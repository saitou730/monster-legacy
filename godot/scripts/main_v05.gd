extends "res://scripts/main_v04.gd"

# Exact locked runtime rasters mirrored from canonical assets.
const WIND_IDLE: Texture2D = preload("res://assets/wind_bat/idle.png")
const WIND_ATTACK: Texture2D = preload("res://assets/wind_bat/attack.png")
const WIND_HIT: Texture2D = preload("res://assets/wind_bat/hit.png")
const WIND_DANGER: Texture2D = preload("res://assets/wind_bat/danger.png")
const WIND_STANCE: Texture2D = preload("res://assets/wind_bat/stance.png")

# v0.5 preserves the proven v0.3 command timing while mapping the canonical
# idle/attack/idle proportions onto that teaching window. Exact 500 ms timing
# is a follow-up after first Godot runtime QA so battle feel is not changed blind.
const WIND_TEACHING_ATTACK_TOTAL := 0.34
const WIND_ATTACK_START := 0.24
const WIND_ATTACK_END := 0.54
const WIND_STANCE_POSE_TOTAL := 0.48
const WIND_STANCE_FIRST_FRAME_END_REMAINING := 0.26

var wind_stance_pose_timer := 0.0

func _begin_battle() -> void:
	super()
	wind_stance_pose_timer = 0.0
	battle_message = "SP-031 風コウモリと共に、SP-011 火トカゲへ挑む！"

func _process_battle(delta: float) -> void:
	super(delta)
	wind_stance_pose_timer = maxf(0.0, wind_stance_pose_timer - delta)

func _battle_stance() -> void:
	if mode != MODE_BATTLE or _battle_busy() or enemy_hp <= 0:
		return
	if stance_guard:
		battle_message = "STANCEはすでに発動中。"
		return
	stance_guard = true
	wind_stance_pose_timer = WIND_STANCE_POSE_TOTAL
	battle_message = "風コウモリが高度を上げ、攻撃に備える。"

func _battle_command() -> void:
	if mode != MODE_BATTLE or _battle_busy():
		return
	if enemy_hp <= 0:
		_leave_battle("共鳴が静まった。戦闘終了。")
		return
	if command_points <= 0:
		battle_message = "COMMANDを使い切った。NEXT TURNへ。"
		return
	command_points -= 1
	player_attack_timer = WIND_TEACHING_ATTACK_TOTAL
	player_attack_applied = false
	battle_message = "風コウモリが一気に間合いを詰める！"

func _draw_player_pixel_monster(center: Vector2) -> void:
	# SP-031 motion contract: hover/recoil/short impulse only; no anatomy deformation.
	var normal_hover := sin(battle_time * 3.1 + 1.7) * 2.0
	var hover := normal_hover
	if player_hp > 0 and player_hp <= 30:
		hover = normal_hover * 0.35

	var rect := Rect2(center + Vector2(-68.0, -68.0 + hover), Vector2(136.0, 136.0))

	if player_hp <= 0:
		draw_texture_rect(WIND_IDLE, rect, false, Color(1.0, 1.0, 1.0, 0.45))
		return

	if player_attack_timer > 0.0:
		var p := 1.0 - player_attack_timer / WIND_TEACHING_ATTACK_TOTAL
		if p >= WIND_ATTACK_START and p < WIND_ATTACK_END:
			draw_texture_rect(WIND_ATTACK, rect, false)
		else:
			draw_texture_rect(WIND_IDLE, rect, false)
		return

	if player_flash > 0.0:
		# Small runtime recoil translation is supplied by arena shake; exact hit raster is preserved.
		draw_texture_rect(WIND_HIT, rect, false)
		return

	if wind_stance_pose_timer > WIND_STANCE_FIRST_FRAME_END_REMAINING:
		draw_texture_rect(WIND_STANCE, rect, false)
		return

	if player_hp <= 30:
		draw_texture_rect(WIND_DANGER, rect, false)
		return

	draw_texture_rect(WIND_IDLE, rect, false)

func _draw_battle_panels() -> void:
	draw_rect(Rect2(Vector2(20, 86), Vector2(210, 67)), Color("f4eedb"))
	draw_rect(Rect2(Vector2(25, 91), Vector2(200, 57)), Color("21313e"), false, 3.0)
	draw_string(ThemeDB.fallback_font, Vector2(34, 112), "SP-011 火トカゲ", HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color("1d2730"))
	_draw_hp_bar(Vector2(34, 126), 176.0, enemy_hp, Color("dd6b46"))

	draw_rect(Rect2(Vector2(164, 377), Vector2(206, 79)), Color("f4eedb"))
	draw_rect(Rect2(Vector2(169, 382), Vector2(196, 69)), Color("21313e"), false, 3.0)
	draw_string(ThemeDB.fallback_font, Vector2(180, 405), "SP-031 風コウモリ", HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color("1d2730"))
	_draw_hp_bar(Vector2(180, 419), 166.0, player_hp, Color("5b77b8"))
	draw_string(ThemeDB.fallback_font, Vector2(180, 444), "COMMAND %d/2   STANCE %s" % [command_points, "ON" if stance_guard else "READY"], HORIZONTAL_ALIGNMENT_LEFT, -1, 10, Color("344b5e"))

	draw_rect(Rect2(Vector2(18, 488), Vector2(354, 166)), Color("f4eedb"))
	draw_rect(Rect2(Vector2(24, 494), Vector2(342, 154)), Color("21313e"), false, 3.0)
	draw_string(ThemeDB.fallback_font, Vector2(36, 523), battle_message, HORIZONTAL_ALIGNMENT_LEFT, 318, 12, Color("1d2730"))
	draw_string(ThemeDB.fallback_font, Vector2(36, 618), "LOCKED ART: SP-031 vs SP-011 / exact rasters", HORIZONTAL_ALIGNMENT_LEFT, -1, 10, Color("66727a"))
