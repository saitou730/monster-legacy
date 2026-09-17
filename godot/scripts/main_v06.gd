extends Node2D

const MODE_FIELD = 0
const MODE_TRANSITION = 1
const MODE_BATTLE = 2

const VIEW_W = 390.0
const VIEW_H = 844.0
const WORLD_TOP = 64.0
const WORLD_BOTTOM = 676.0
const MOVE_SPEED = 118.0

const COMMAND_BUTTON = Rect2(24.0, 684.0, 164.0, 58.0)
const STANCE_BUTTON = Rect2(202.0, 684.0, 164.0, 58.0)
const NEXT_BUTTON = Rect2(24.0, 752.0, 164.0, 48.0)
const RUN_BUTTON = Rect2(202.0, 752.0, 164.0, 48.0)
const DPAD_CENTER = Vector2(72.0, 756.0)
const DPAD_RADIUS = 66.0

const GRASS_AREAS = [
	Rect2(84.0, 234.0, 56.0, 56.0),
	Rect2(266.0, 256.0, 58.0, 58.0),
	Rect2(66.0, 438.0, 58.0, 58.0),
	Rect2(274.0, 454.0, 58.0, 58.0)
]

var mode = MODE_FIELD
var player_pos = Vector2(195.0, 520.0)
var facing = Vector2(0.0, 1.0)
var moving = false
var touch_direction = Vector2.ZERO
var touch_active = false
var field_time = 0.0
var grass_dwell = 0.0
var encounter_cooldown = 0.0
var transition_time = 0.0

var battle_time = 0.0
var turn_index = 1
var command_points = 2
var stance_guard = false
var enemy_hp = 100
var player_hp = 100
var battle_message = "草むらに気配がある…"

var player_attack_timer = 0.0
var player_attack_done = false
var enemy_attack_timer = 0.0
var enemy_attack_done = false
var enemy_hit_timer = 0.0
var player_hit_timer = 0.0
var ko_timer = 0.0
var shake_timer = 0.0
var hit_stop_timer = 0.0

var fire_idle = null
var fire_attack = null
var fire_hit = null
var fire_danger = null
var fire_stance = null
var bat_idle = null
var bat_attack = null
var bat_hit = null
var bat_danger = null
var bat_stance = null

func _ready():
	fire_idle = load("res://assets/fire/idle.png")
	fire_attack = load("res://assets/fire/attack.png")
	fire_hit = load("res://assets/fire/hit.png")
	fire_danger = load("res://assets/fire/danger.png")
	fire_stance = load("res://assets/fire/stance.png")
	bat_idle = load("res://assets/wind_bat/idle.png")
	bat_attack = load("res://assets/wind_bat/attack.png")
	bat_hit = load("res://assets/wind_bat/hit.png")
	bat_danger = load("res://assets/wind_bat/danger.png")
	bat_stance = load("res://assets/wind_bat/stance.png")
	queue_redraw()

func _process(delta):
	if encounter_cooldown > 0.0:
		encounter_cooldown -= delta
		if encounter_cooldown < 0.0:
			encounter_cooldown = 0.0
	if enemy_hit_timer > 0.0:
		enemy_hit_timer -= delta
	if player_hit_timer > 0.0:
		player_hit_timer -= delta
	if shake_timer > 0.0:
		shake_timer -= delta
	if hit_stop_timer > 0.0:
		hit_stop_timer -= delta
		queue_redraw()
		return

	if mode == MODE_FIELD:
		field_time += delta
		_process_field(delta)
	elif mode == MODE_TRANSITION:
		transition_time += delta
		if transition_time >= 0.65:
			_begin_battle()
	elif mode == MODE_BATTLE:
		battle_time += delta
		_process_battle(delta)
	queue_redraw()

func _process_field(delta):
	var direction = Vector2.ZERO
	if Input.is_key_pressed(KEY_LEFT) or Input.is_key_pressed(KEY_A):
		direction.x -= 1.0
	if Input.is_key_pressed(KEY_RIGHT) or Input.is_key_pressed(KEY_D):
		direction.x += 1.0
	if Input.is_key_pressed(KEY_UP) or Input.is_key_pressed(KEY_W):
		direction.y -= 1.0
	if Input.is_key_pressed(KEY_DOWN) or Input.is_key_pressed(KEY_S):
		direction.y += 1.0
	if touch_direction != Vector2.ZERO:
		direction = touch_direction
	if direction.length() > 1.0:
		direction = direction.normalized()

	moving = direction != Vector2.ZERO
	if moving:
		facing = direction
		player_pos += direction * MOVE_SPEED * delta
		player_pos.x = clamp(player_pos.x, 26.0, VIEW_W - 26.0)
		player_pos.y = clamp(player_pos.y, WORLD_TOP + 28.0, WORLD_BOTTOM - 30.0)

	if _player_in_grass() and moving and encounter_cooldown <= 0.0:
		grass_dwell += delta
		if grass_dwell >= 0.40:
			_start_transition()
	else:
		grass_dwell -= delta * 3.0
		if grass_dwell < 0.0:
			grass_dwell = 0.0

func _process_battle(delta):
	if player_attack_timer > 0.0:
		player_attack_timer -= delta
		if player_attack_timer < 0.0:
			player_attack_timer = 0.0
		if player_attack_timer <= 0.27 and not player_attack_done:
			player_attack_done = true
			_apply_player_attack()
	elif enemy_attack_timer > 0.0:
		enemy_attack_timer -= delta
		if enemy_attack_timer < 0.0:
			enemy_attack_timer = 0.0
		if enemy_attack_timer <= 0.31 and not enemy_attack_done:
			enemy_attack_done = true
			_apply_enemy_attack()

	if enemy_hp <= 0:
		ko_timer += delta
		if ko_timer > 0.85:
			battle_message = "火トカゲは戦意を失った。COMMANDで戻る。"

func _input(event):
	if event is InputEventScreenTouch:
		if event.pressed:
			_handle_pointer_down(event.position)
		else:
			touch_active = false
			touch_direction = Vector2.ZERO
	elif event is InputEventScreenDrag:
		if touch_active and mode == MODE_FIELD:
			touch_direction = _touch_direction(event.position)
	elif event is InputEventMouseButton:
		if event.pressed:
			_handle_pointer_down(event.position)
	elif event is InputEventKey:
		if event.pressed and mode == MODE_BATTLE:
			if event.keycode == KEY_1 or event.keycode == KEY_SPACE:
				_battle_command()
			elif event.keycode == KEY_2:
				_battle_stance()
			elif event.keycode == KEY_ENTER:
				_advance_turn()
			elif event.keycode == KEY_ESCAPE:
				_leave_battle()

func _handle_pointer_down(pos):
	if mode == MODE_FIELD:
		touch_active = true
		touch_direction = _touch_direction(pos)
	elif mode == MODE_BATTLE:
		if COMMAND_BUTTON.has_point(pos):
			_battle_command()
		elif STANCE_BUTTON.has_point(pos):
			_battle_stance()
		elif NEXT_BUTTON.has_point(pos):
			_advance_turn()
		elif RUN_BUTTON.has_point(pos):
			_leave_battle()

func _touch_direction(pos):
	var d = pos - DPAD_CENTER
	if d.length() > DPAD_RADIUS:
		return Vector2.ZERO
	if abs(d.x) > abs(d.y):
		if d.x > 8.0:
			return Vector2(1.0, 0.0)
		if d.x < -8.0:
			return Vector2(-1.0, 0.0)
	else:
		if d.y > 8.0:
			return Vector2(0.0, 1.0)
		if d.y < -8.0:
			return Vector2(0.0, -1.0)
	return Vector2.ZERO

func _player_in_grass():
	for area in GRASS_AREAS:
		if area.has_point(player_pos):
			return true
	return false

func _start_transition():
	mode = MODE_TRANSITION
	transition_time = 0.0
	grass_dwell = 0.0
	moving = false
	touch_direction = Vector2.ZERO
	touch_active = false

func _begin_battle():
	mode = MODE_BATTLE
	battle_time = 0.0
	turn_index = 1
	command_points = 2
	stance_guard = false
	enemy_hp = 100
	player_hp = 100
	player_attack_timer = 0.0
	enemy_attack_timer = 0.0
	player_attack_done = false
	enemy_attack_done = false
	enemy_hit_timer = 0.0
	player_hit_timer = 0.0
	ko_timer = 0.0
	battle_message = "SP-011 火トカゲが行く手をふさいだ！"

func _battle_busy():
	return player_attack_timer > 0.0 or enemy_attack_timer > 0.0 or hit_stop_timer > 0.0

func _battle_command():
	if mode != MODE_BATTLE:
		return
	if _battle_busy():
		return
	if enemy_hp <= 0:
		_leave_battle()
		return
	if command_points <= 0:
		battle_message = "COMMANDを使い切った。NEXT TURNへ。"
		return
	command_points -= 1
	player_attack_timer = 0.50
	player_attack_done = false
	battle_message = "風コウモリが飛び込む！"

func _battle_stance():
	if mode != MODE_BATTLE or _battle_busy() or enemy_hp <= 0:
		return
	if stance_guard:
		battle_message = "STANCEはすでに有効。"
		return
	stance_guard = true
	battle_message = "STANCE：次の被ダメージを軽減。"

func _advance_turn():
	if mode != MODE_BATTLE or _battle_busy() or enemy_hp <= 0 or player_hp <= 0:
		return
	enemy_attack_timer = 0.56
	enemy_attack_done = false
	battle_message = "火トカゲがこちらを狙っている…"

func _apply_player_attack():
	var damage = 22
	if turn_index == 1:
		damage = 28
	enemy_hp -= damage
	if enemy_hp < 0:
		enemy_hp = 0
	enemy_hit_timer = 0.16
	hit_stop_timer = 0.05
	shake_timer = 0.18
	battle_message = "COMMAND命中。%dダメージ！" % damage
	if enemy_hp <= 0:
		ko_timer = 0.0
		battle_message = "火トカゲの足元が崩れた！"

func _apply_enemy_attack():
	var damage = 16
	if stance_guard:
		damage = 8
	player_hp -= damage
	if player_hp < 0:
		player_hp = 0
	player_hit_timer = 0.16
	hit_stop_timer = 0.05
	shake_timer = 0.18
	turn_index += 1
	command_points = 2
	stance_guard = false
	battle_message = "火トカゲの攻撃。%dダメージ。TURN %d。" % [damage, turn_index]
	if player_hp <= 0:
		battle_message = "パーティは押し戻された。RUNで戻る。"

func _leave_battle():
	mode = MODE_FIELD
	encounter_cooldown = 1.8
	grass_dwell = 0.0
	player_pos.y += 34.0
	if player_pos.y > WORLD_BOTTOM - 40.0:
		player_pos.y = WORLD_BOTTOM - 40.0
	battle_message = "フィールドへ戻った。"

func _draw():
	if mode == MODE_BATTLE:
		_draw_battle()
	else:
		_draw_field()
		if mode == MODE_TRANSITION:
			_draw_transition()

func _draw_field():
	draw_rect(Rect2(0.0, 0.0, VIEW_W, VIEW_H), Color(0.06, 0.09, 0.12, 1.0))
	draw_rect(Rect2(0.0, WORLD_TOP, VIEW_W, WORLD_BOTTOM - WORLD_TOP), Color(0.39, 0.56, 0.31, 1.0))

	for y in range(int(WORLD_TOP), int(WORLD_BOTTOM), 24):
		for x in range(0, int(VIEW_W), 24):
			if (int(x / 24) + int(y / 24)) % 2 == 0:
				draw_rect(Rect2(x, y, 24, 24), Color(0.42, 0.60, 0.34, 1.0))

	draw_rect(Rect2(147.0, WORLD_TOP, 96.0, WORLD_BOTTOM - WORLD_TOP), Color(0.75, 0.65, 0.43, 1.0))
	draw_rect(Rect2(154.0, WORLD_TOP, 82.0, WORLD_BOTTOM - WORLD_TOP), Color(0.86, 0.79, 0.55, 1.0))
	draw_rect(Rect2(18.0, 162.0, 92.0, 54.0), Color(0.35, 0.58, 0.66, 1.0))
	draw_rect(Rect2(93.0, 176.0, 70.0, 24.0), Color(0.56, 0.42, 0.26, 1.0))

	_draw_grass()
	_draw_player()
	_draw_field_hud()
	_draw_dpad()

func _draw_grass():
	for area in GRASS_AREAS:
		draw_rect(area, Color(0.16, 0.37, 0.20, 1.0), false, 2.0)
		for row in range(5):
			for col in range(5):
				var p = area.position + Vector2(5.0 + col * 10.0, 8.0 + row * 9.0)
				var sway = sin(field_time * 5.0 + col + row) * 1.5
				draw_line(p + Vector2(0.0, 7.0), p + Vector2(4.0 + sway, 0.0), Color(0.10, 0.30, 0.15, 1.0), 2.0)

func _draw_player():
	var bob = 0.0
	if moving:
		if int(Time.get_ticks_msec() / 140) % 2 == 0:
			bob = 1.0
		else:
			bob = -1.0
	var o = player_pos + Vector2(-9.0, -12.0 + bob)
	draw_rect(Rect2(o.x + 4.0, o.y + 1.0, 10.0, 8.0), Color(0.91, 0.76, 0.62, 1.0))
	draw_rect(Rect2(o.x + 2.0, o.y + 8.0, 14.0, 11.0), Color(0.16, 0.24, 0.39, 1.0))
	draw_rect(Rect2(o.x + 4.0, o.y + 19.0, 4.0, 5.0), Color(0.10, 0.15, 0.23, 1.0))
	draw_rect(Rect2(o.x + 10.0, o.y + 19.0, 4.0, 5.0), Color(0.10, 0.15, 0.23, 1.0))

func _draw_field_hud():
	draw_rect(Rect2(0.0, 0.0, VIEW_W, WORLD_TOP), Color(0.09, 0.14, 0.20, 1.0))
	draw_rect(Rect2(0.0, WORLD_BOTTOM, VIEW_W, VIEW_H - WORLD_BOTTOM), Color(0.09, 0.14, 0.20, 1.0))
	draw_string(ThemeDB.fallback_font, Vector2(18.0, 29.0), "MONSTER LEGACY", HORIZONTAL_ALIGNMENT_LEFT, -1, 18, Color(0.96, 0.94, 0.87, 1.0))
	draw_string(ThemeDB.fallback_font, Vector2(18.0, 51.0), "GODOT ANDROID SAFE v0.6", HORIZONTAL_ALIGNMENT_LEFT, -1, 11, Color(0.62, 0.71, 0.78, 1.0))
	draw_string(ThemeDB.fallback_font, Vector2(160.0, 730.0), "草むらへ入るとエンカウント", HORIZONTAL_ALIGNMENT_LEFT, 214.0, 12, Color(0.96, 0.94, 0.87, 1.0))

func _draw_dpad():
	var c = Color(0.15, 0.23, 0.31, 1.0)
	draw_rect(Rect2(DPAD_CENTER.x - 18.0, DPAD_CENTER.y - 60.0, 36.0, 120.0), c)
	draw_rect(Rect2(DPAD_CENTER.x - 60.0, DPAD_CENTER.y - 18.0, 120.0, 36.0), c)
	draw_rect(Rect2(DPAD_CENTER.x - 9.0, DPAD_CENTER.y - 9.0, 18.0, 18.0), Color(0.06, 0.10, 0.14, 1.0))

func _draw_transition():
	var progress = transition_time / 0.65
	if progress > 1.0:
		progress = 1.0
	for i in range(9):
		var stripe_h = 96.0
		var offset = (1.0 - progress) * VIEW_W
		var stripe_x = -offset
		if i % 2 == 1:
			stripe_x = offset
		draw_rect(Rect2(stripe_x, i * stripe_h, VIEW_W, stripe_h + 2.0), Color(0.05, 0.08, 0.11, 1.0))
	if progress > 0.55:
		draw_string(ThemeDB.fallback_font, Vector2(132.0, 424.0), "ENCOUNTER", HORIZONTAL_ALIGNMENT_LEFT, -1, 20, Color(0.96, 0.94, 0.87, 1.0))

func _draw_battle():
	var shake = Vector2.ZERO
	if shake_timer > 0.0:
		if int(Time.get_ticks_msec() / 35) % 2 == 0:
			shake = Vector2(3.0, -2.0)
		else:
			shake = Vector2(-3.0, 2.0)

	draw_rect(Rect2(0.0, 0.0, VIEW_W, VIEW_H), Color(0.06, 0.09, 0.12, 1.0))
	draw_rect(Rect2(0.0, 0.0, VIEW_W, 66.0), Color(0.09, 0.14, 0.20, 1.0))
	draw_rect(Rect2(0.0, 66.0, VIEW_W, 406.0), Color(0.62, 0.78, 0.81, 1.0))
	draw_rect(Rect2(0.0, 256.0, VIEW_W, 216.0), Color(0.50, 0.64, 0.44, 1.0))
	draw_rect(Rect2(0.0, 372.0, VIEW_W, 100.0), Color(0.33, 0.45, 0.31, 1.0))
	draw_string(ThemeDB.fallback_font, Vector2(18.0, 29.0), "MONSTER LEGACY", HORIZONTAL_ALIGNMENT_LEFT, -1, 18, Color(0.96, 0.94, 0.87, 1.0))
	draw_string(ThemeDB.fallback_font, Vector2(18.0, 51.0), "BATTLE / TURN %d" % turn_index, HORIZONTAL_ALIGNMENT_LEFT, -1, 11, Color(0.62, 0.71, 0.78, 1.0))

	_draw_enemy(Vector2(282.0, 200.0) + shake)
	_draw_party(Vector2(96.0, 346.0) + shake)
	_draw_battle_panels()
	_draw_battle_buttons()

func _draw_enemy(center):
	var texture = fire_idle
	if enemy_hp <= 0:
		texture = fire_idle
	elif enemy_hit_timer > 0.0:
		texture = fire_hit
	elif enemy_attack_timer > 0.0:
		if enemy_attack_timer < 0.42 and enemy_attack_timer > 0.25:
			texture = fire_attack
	elif enemy_hp <= 30:
		texture = fire_danger
	elif stance_guard:
		texture = fire_idle
	var bob = sin(battle_time * 4.0) * 2.0
	var alpha = 1.0
	var drop = 0.0
	if enemy_hp <= 0:
		alpha = 1.0 - ko_timer / 0.75
		if alpha < 0.0:
			alpha = 0.0
		drop = ko_timer * 28.0
	_draw_monster_texture(texture, center + Vector2(0.0, bob + drop), 132.0, alpha)

func _draw_party(center):
	var texture = bat_idle
	if player_hit_timer > 0.0:
		texture = bat_hit
	elif player_attack_timer > 0.0:
		if player_attack_timer < 0.38 and player_attack_timer > 0.18:
			texture = bat_attack
	elif stance_guard:
		texture = bat_stance
	elif player_hp <= 30:
		texture = bat_danger
	var bob = sin(battle_time * 3.1 + 1.7) * 1.5
	_draw_monster_texture(texture, center + Vector2(0.0, bob), 138.0, 1.0)

func _draw_monster_texture(texture, center, size, alpha):
	if texture == null:
		draw_rect(Rect2(center.x - 32.0, center.y - 32.0, 64.0, 64.0), Color(0.8, 0.3, 0.2, alpha))
		return
	var rect = Rect2(center.x - size * 0.5, center.y - size * 0.5, size, size)
	draw_texture_rect(texture, rect, false, Color(1.0, 1.0, 1.0, alpha))

func _draw_battle_panels():
	draw_rect(Rect2(20.0, 86.0, 210.0, 67.0), Color(0.96, 0.93, 0.86, 1.0))
	draw_string(ThemeDB.fallback_font, Vector2(34.0, 112.0), "SP-011 火トカゲ", HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color(0.12, 0.16, 0.19, 1.0))
	_draw_hp_bar(Vector2(34.0, 126.0), 176.0, enemy_hp, Color(0.87, 0.42, 0.27, 1.0))

	draw_rect(Rect2(164.0, 377.0, 206.0, 79.0), Color(0.96, 0.93, 0.86, 1.0))
	draw_string(ThemeDB.fallback_font, Vector2(180.0, 405.0), "SP-031 風コウモリ", HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color(0.12, 0.16, 0.19, 1.0))
	_draw_hp_bar(Vector2(180.0, 419.0), 166.0, player_hp, Color(0.36, 0.47, 0.72, 1.0))
	var stance_text = "READY"
	if stance_guard:
		stance_text = "ON"
	draw_string(ThemeDB.fallback_font, Vector2(180.0, 444.0), "COMMAND %d/2  STANCE %s" % [command_points, stance_text], HORIZONTAL_ALIGNMENT_LEFT, -1, 10, Color(0.20, 0.29, 0.37, 1.0))

	draw_rect(Rect2(18.0, 488.0, 354.0, 166.0), Color(0.96, 0.93, 0.86, 1.0))
	draw_string(ThemeDB.fallback_font, Vector2(36.0, 523.0), battle_message, HORIZONTAL_ALIGNMENT_LEFT, 318.0, 12, Color(0.12, 0.16, 0.19, 1.0))
	draw_string(ThemeDB.fallback_font, Vector2(36.0, 618.0), "LOCKED ART / GODOT v0.6", HORIZONTAL_ALIGNMENT_LEFT, -1, 10, Color(0.40, 0.45, 0.48, 1.0))

func _draw_hp_bar(pos, width, hp, fill):
	draw_rect(Rect2(pos.x, pos.y, width, 9.0), Color(0.17, 0.20, 0.22, 1.0))
	var ratio = float(hp) / 100.0
	if ratio < 0.0:
		ratio = 0.0
	if ratio > 1.0:
		ratio = 1.0
	draw_rect(Rect2(pos.x + 2.0, pos.y + 2.0, (width - 4.0) * ratio, 5.0), fill)

func _draw_battle_buttons():
	_draw_button(COMMAND_BUTTON, "COMMAND", Color(0.53, 0.29, 0.22, 1.0))
	_draw_button(STANCE_BUTTON, "STANCE", Color(0.22, 0.36, 0.42, 1.0))
	_draw_button(NEXT_BUTTON, "NEXT TURN", Color(0.30, 0.40, 0.28, 1.0))
	_draw_button(RUN_BUTTON, "RUN", Color(0.30, 0.31, 0.35, 1.0))

func _draw_button(rect, title, fill):
	draw_rect(rect, fill)
	draw_string(ThemeDB.fallback_font, rect.position + Vector2(12.0, 33.0), title, HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color(1.0, 0.97, 0.90, 1.0))
