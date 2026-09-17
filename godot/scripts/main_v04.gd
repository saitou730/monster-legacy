extends "res://scripts/main_v03.gd"

# Exact locked runtime rasters mirrored from the canonical repository assets.
# Do not redraw, recolor, pixel-synthesize, or destructively edit these files.
const FIRE_IDLE: Texture2D = preload("res://assets/fire/idle.png")
const FIRE_ATTACK: Texture2D = preload("res://assets/fire/attack.png")
const FIRE_HIT: Texture2D = preload("res://assets/fire/hit.png")
const FIRE_DANGER: Texture2D = preload("res://assets/fire/danger.png")
const FIRE_STANCE: Texture2D = preload("res://assets/fire/stance.png")

const FIRE_ATTACK_TOTAL := 0.56
const FIRE_ATTACK_IMPACT_PROGRESS := 0.40

func _begin_battle() -> void:
	super()
	battle_message = "SP-011 火トカゲが行く手をふさいだ！"

func _process_battle(delta: float) -> void:
	if player_attack_timer > 0.0:
		player_attack_timer = maxf(0.0, player_attack_timer - delta)
		var player_progress := 1.0 - player_attack_timer / 0.34
		if player_progress >= 0.43 and not player_attack_applied:
			player_attack_applied = true
			_apply_player_attack()
	elif enemy_attack_timer > 0.0:
		enemy_attack_timer = maxf(0.0, enemy_attack_timer - delta)
		var enemy_progress := 1.0 - enemy_attack_timer / FIRE_ATTACK_TOTAL
		if enemy_progress >= FIRE_ATTACK_IMPACT_PROGRESS and not enemy_attack_applied:
			enemy_attack_applied = true
			_apply_enemy_attack()

	if enemy_hp <= 0:
		ko_timer += delta
		if ko_timer > 0.85:
			battle_message = "火トカゲは戦意を失った。COMMANDでフィールドへ戻る。"

func _advance_turn() -> void:
	if mode != MODE_BATTLE or _battle_busy() or enemy_hp <= 0 or player_hp <= 0:
		return
	enemy_attack_timer = FIRE_ATTACK_TOTAL
	enemy_attack_applied = false
	battle_message = "火トカゲがこちらの構えを読んでいる…"

func _apply_player_attack() -> void:
	var damage := 28 if turn_index == 1 else 22
	enemy_hp = maxi(0, enemy_hp - damage)
	enemy_flash = 0.16
	hitstop_timer = 0.055
	shake_timer = 0.18
	_spawn_hit_particles(Vector2(281, 194), Color("ffd36a"))
	battle_message = "COMMANDが命中。火トカゲに%dダメージ。" % damage
	if enemy_hp <= 0:
		ko_timer = 0.0
		battle_message = "火トカゲの足元が崩れた！"

func _apply_enemy_attack() -> void:
	var incoming := 8 if stance_guard else 16
	player_hp = maxi(0, player_hp - incoming)
	player_flash = 0.14
	hitstop_timer = 0.055
	shake_timer = 0.18
	_spawn_hit_particles(Vector2(98, 347), Color("f78a62"))
	turn_index += 1
	command_points = 2
	stance_guard = false
	battle_message = "火トカゲの攻撃。%dダメージ。TURN %d。" % [incoming, turn_index]
	if player_hp <= 0:
		battle_message = "パーティは押し戻された。RUNでフィールドへ戻る。"

func _draw_enemy_pixel_monster(center: Vector2) -> void:
	# Motion follows AREA01_SP011_RUNTIME_MOTION_SPEC:
	# idle bob = transform only; attack = idle -> attack -> idle; hit/danger use exact governed rasters.
	var bob := sin(battle_time * 4.0) * 2.0
	var fade := 1.0
	var drop := 0.0
	if enemy_hp <= 0:
		fade = clampf(1.0 - ko_timer / 0.75, 0.0, 1.0)
		drop = minf(24.0, ko_timer * 34.0)

	var rect := Rect2(center + Vector2(-66.0, -66.0 + bob + drop), Vector2(132.0, 132.0))
	var tint := Color(1.0, 1.0, 1.0, fade)

	if enemy_hp <= 0:
		draw_texture_rect(FIRE_IDLE, rect, false, tint)
		return

	if enemy_attack_timer > 0.0:
		var p := 1.0 - enemy_attack_timer / FIRE_ATTACK_TOTAL
		# 140 ms idle / 170 ms attack / 250 ms settle, normalized to the 560 ms spec.
		if p >= 0.25 and p < 0.554:
			draw_texture_rect(FIRE_ATTACK, rect, false, tint)
		else:
			draw_texture_rect(FIRE_IDLE, rect, false, tint)
		return

	if enemy_flash > 0.0:
		draw_texture_rect(FIRE_HIT, rect, false, Color(1.0, 1.0, 1.0, fade))
		return

	if enemy_hp <= 30:
		var pulse := 1.0 + sin(battle_time * 5.0) * 0.015
		var danger_size := Vector2(132.0, 132.0) * pulse
		var danger_rect := Rect2(center - danger_size * 0.5 + Vector2(0.0, bob + drop), danger_size)
		draw_texture_rect(FIRE_DANGER, danger_rect, false, tint)
		return

	draw_texture_rect(FIRE_IDLE, rect, false, tint)

func _draw_battle_panels() -> void:
	draw_rect(Rect2(Vector2(20, 86), Vector2(210, 67)), Color("f4eedb"))
	draw_rect(Rect2(Vector2(25, 91), Vector2(200, 57)), Color("21313e"), false, 3.0)
	draw_string(ThemeDB.fallback_font, Vector2(34, 112), "SP-011 火トカゲ", HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color("1d2730"))
	_draw_hp_bar(Vector2(34, 126), 176.0, enemy_hp, Color("dd6b46"))

	draw_rect(Rect2(Vector2(164, 377), Vector2(206, 79)), Color("f4eedb"))
	draw_rect(Rect2(Vector2(169, 382), Vector2(196, 69)), Color("21313e"), false, 3.0)
	draw_string(ThemeDB.fallback_font, Vector2(180, 405), "PARTY LEAD", HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color("1d2730"))
	_draw_hp_bar(Vector2(180, 419), 166.0, player_hp, Color("5b77b8"))
	draw_string(ThemeDB.fallback_font, Vector2(180, 444), "COMMAND %d/2   STANCE %s" % [command_points, "ON" if stance_guard else "READY"], HORIZONTAL_ALIGNMENT_LEFT, -1, 10, Color("344b5e"))

	draw_rect(Rect2(Vector2(18, 488), Vector2(354, 166)), Color("f4eedb"))
	draw_rect(Rect2(Vector2(24, 494), Vector2(342, 154)), Color("21313e"), false, 3.0)
	draw_string(ThemeDB.fallback_font, Vector2(36, 523), battle_message, HORIZONTAL_ALIGNMENT_LEFT, 318, 12, Color("1d2730"))
	draw_string(ThemeDB.fallback_font, Vector2(36, 618), "LOCKED ART: exact SP-011 runtime rasters", HORIZONTAL_ALIGNMENT_LEFT, -1, 10, Color("66727a"))
