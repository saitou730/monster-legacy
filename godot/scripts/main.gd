extends Node2D

const BASE_SIZE := Vector2(390.0, 844.0)
const WORLD_TOP := 64.0
const WORLD_BOTTOM := 676.0
const PLAYER_SIZE := Vector2(18.0, 24.0)
const MOVE_SPEED := 118.0
const D_PAD_CENTER := Vector2(72.0, 756.0)
const D_PAD_RADIUS := 66.0

const MODE_FIELD := 0
const MODE_TRANSITION := 1
const MODE_BATTLE := 2

const GRASS_AREAS := [
	Rect2(86.0, 242.0, 48.0, 48.0),
	Rect2(272.0, 262.0, 48.0, 48.0),
	Rect2(72.0, 446.0, 48.0, 48.0),
	Rect2(278.0, 460.0, 48.0, 48.0)
]

const ATTACK_BUTTON := Rect2(24.0, 682.0, 164.0, 58.0)
const STANCE_BUTTON := Rect2(202.0, 682.0, 164.0, 58.0)
const RUN_BUTTON := Rect2(202.0, 752.0, 164.0, 48.0)
const NEXT_BUTTON := Rect2(24.0, 752.0, 164.0, 48.0)

var player_pos := Vector2(195.0, 500.0)
var touch_direction := Vector2.ZERO
var active_touch := false
var facing := Vector2.DOWN

var mode := MODE_FIELD
var grass_dwell := 0.0
var encounter_cooldown := 0.0
var transition_time := 0.0
var battle_time := 0.0
var enemy_hp := 100
var player_hp := 100
var enemy_flash := 0.0
var player_flash := 0.0
var battle_message := "A wild presence answers the resonance."
var stance_guard := false
var turn_index := 1
var command_points := 2

func _ready() -> void:
	texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	queue_redraw()

func _process(delta: float) -> void:
	encounter_cooldown = maxf(0.0, encounter_cooldown - delta)
	enemy_flash = maxf(0.0, enemy_flash - delta)
	player_flash = maxf(0.0, player_flash - delta)

	if mode == MODE_FIELD:
		_process_field(delta)
	elif mode == MODE_TRANSITION:
		transition_time += delta
		if transition_time >= 0.72:
			_begin_battle()
		queue_redraw()
	elif mode == MODE_BATTLE:
		battle_time += delta
		queue_redraw()

func _process_field(delta: float) -> void:
	var direction := Vector2.ZERO
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

	if direction.length_squared() > 1.0:
		direction = direction.normalized()

	if direction != Vector2.ZERO:
		facing = direction
		player_pos += direction * MOVE_SPEED * delta
		player_pos.x = clampf(player_pos.x, 30.0, BASE_SIZE.x - 30.0)
		player_pos.y = clampf(player_pos.y, WORLD_TOP + 28.0, WORLD_BOTTOM - 28.0)
		queue_redraw()

	if _player_in_grass() and encounter_cooldown <= 0.0 and direction != Vector2.ZERO:
		grass_dwell += delta
		if grass_dwell >= 0.42:
			_start_transition()
	else:
		grass_dwell = maxf(0.0, grass_dwell - delta * 2.5)

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_handle_pointer_down(event.position)
		else:
			active_touch = false
			touch_direction = Vector2.ZERO
		queue_redraw()
	elif event is InputEventScreenDrag and active_touch and mode == MODE_FIELD:
		touch_direction = _touch_direction(event.position)
		queue_redraw()
	elif event is InputEventMouseButton and event.pressed:
		_handle_pointer_down(event.position)
	elif event is InputEventKey and event.pressed and mode == MODE_BATTLE:
		if event.keycode == KEY_1 or event.keycode == KEY_SPACE:
			_battle_attack()
		elif event.keycode == KEY_2:
			_battle_stance()
		elif event.keycode == KEY_ESCAPE:
			_leave_battle("You withdrew from the encounter.")

func _handle_pointer_down(position: Vector2) -> void:
	if mode == MODE_FIELD:
		active_touch = true
		touch_direction = _touch_direction(position)
	elif mode == MODE_BATTLE:
		if ATTACK_BUTTON.has_point(position):
			_battle_attack()
		elif STANCE_BUTTON.has_point(position):
			_battle_stance()
		elif RUN_BUTTON.has_point(position):
			_leave_battle("You withdrew from the encounter.")
		elif NEXT_BUTTON.has_point(position):
			_advance_turn()

func _touch_direction(position: Vector2) -> Vector2:
	var delta := position - D_PAD_CENTER
	if delta.length() > D_PAD_RADIUS:
		return Vector2.ZERO
	if absf(delta.x) > absf(delta.y):
		return Vector2(signf(delta.x), 0.0)
	if absf(delta.y) > 8.0:
		return Vector2(0.0, signf(delta.y))
	return Vector2.ZERO

func _player_in_grass() -> bool:
	for area in GRASS_AREAS:
		if area.has_point(player_pos):
			return true
	return false

func _start_transition() -> void:
	mode = MODE_TRANSITION
	transition_time = 0.0
	grass_dwell = 0.0
	touch_direction = Vector2.ZERO
	active_touch = false
	queue_redraw()

func _begin_battle() -> void:
	mode = MODE_BATTLE
	battle_time = 0.0
	enemy_hp = 100
	player_hp = 100
	stance_guard = false
	turn_index = 1
	command_points = 2
	battle_message = "SP-001 FIRE LIZARD blocks the path!"
	queue_redraw()

func _battle_attack() -> void:
	if mode != MODE_BATTLE:
		return
	if enemy_hp <= 0:
		_leave_battle("The resonance settled. Encounter complete.")
		return
	if command_points <= 0:
		battle_message = "No COMMAND remains. Advance the turn."
		queue_redraw()
		return

	command_points -= 1
	var damage := 28 if turn_index == 1 else 22
	enemy_hp = maxi(0, enemy_hp - damage)
	enemy_flash = 0.16
	battle_message = "COMMAND hits for %d. FIRE LIZARD staggers." % damage

	if enemy_hp <= 0:
		battle_message = "FIRE LIZARD yields. Tap COMMAND to return."
	queue_redraw()

func _battle_stance() -> void:
	if mode != MODE_BATTLE:
		return
	if stance_guard:
		battle_message = "STANCE is already active this turn."
		queue_redraw()
		return
	stance_guard = true
	battle_message = "STANCE: Guard Resonance. Incoming damage is reduced."
	queue_redraw()

func _advance_turn() -> void:
	if mode != MODE_BATTLE or enemy_hp <= 0:
		return
	var incoming := 8 if stance_guard else 16
	player_hp = maxi(0, player_hp - incoming)
	player_flash = 0.16
	turn_index += 1
	command_points = 2
	stance_guard = false
	battle_message = "Enemy strikes for %d. NEXT is now locked for turn %d." % [incoming, turn_index]
	if player_hp <= 0:
		battle_message = "The party falls back. Tap RUN to return to the field."
	queue_redraw()

func _leave_battle(message: String) -> void:
	mode = MODE_FIELD
	encounter_cooldown = 1.8
	grass_dwell = 0.0
	battle_message = message
	player_pos.y = minf(WORLD_BOTTOM - 40.0, player_pos.y + 34.0)
	queue_redraw()

func _draw() -> void:
	if mode == MODE_BATTLE:
		_draw_battle()
	else:
		_draw_field()
		if mode == MODE_TRANSITION:
			_draw_transition()

func _draw_field() -> void:
	_draw_background()
	_draw_field_details()
	_draw_player()
	_draw_hud()
	_draw_dpad()

func _draw_background() -> void:
	draw_rect(Rect2(Vector2.ZERO, BASE_SIZE), Color("101820"))
	draw_rect(Rect2(Vector2(0.0, WORLD_TOP), Vector2(BASE_SIZE.x, WORLD_BOTTOM - WORLD_TOP)), Color("5f8f4f"))

	for y in range(int(WORLD_TOP), int(WORLD_BOTTOM), 24):
		for x in range(0, int(BASE_SIZE.x), 24):
			var alternate := int(x / 24) + int(y / 24)
			if alternate % 2 == 0:
				draw_rect(Rect2(Vector2(x, y), Vector2(24, 24)), Color("648f51"))

	draw_rect(Rect2(Vector2(148.0, WORLD_TOP), Vector2(94.0, WORLD_BOTTOM - WORLD_TOP)), Color("c7ad72"))
	draw_rect(Rect2(Vector2(154.0, WORLD_TOP), Vector2(82.0, WORLD_BOTTOM - WORLD_TOP)), Color("d8c386"))

	# Small shrine marker gives the field a destination and a stronger RPG read.
	draw_rect(Rect2(Vector2(174.0, 90.0), Vector2(42.0, 28.0)), Color("b65d45"))
	draw_rect(Rect2(Vector2(179.0, 118.0), Vector2(32.0, 24.0)), Color("ece2c4"))
	draw_rect(Rect2(Vector2(192.0, 122.0), Vector2(7.0, 20.0)), Color("5b4537"))

func _draw_field_details() -> void:
	for position in [Vector2(26, 106), Vector2(72, 150), Vector2(294, 122), Vector2(330, 180), Vector2(38, 340), Vector2(305, 370), Vector2(42, 566), Vector2(318, 548)]:
		_draw_tree(position)

	for area in GRASS_AREAS:
		for row in range(4):
			for col in range(4):
				var p := area.position + Vector2(4 + col * 10, 5 + row * 10)
				draw_line(p + Vector2(0, 8), p + Vector2(4, 0), Color("234d2d"), 2.0)
				draw_line(p + Vector2(4, 8), p + Vector2(8, 0), Color("2c6136"), 2.0)

func _draw_tree(position: Vector2) -> void:
	draw_rect(Rect2(position + Vector2(11, 26), Vector2(10, 18)), Color("6b4726"))
	draw_rect(Rect2(position + Vector2(2, 10), Vector2(28, 24)), Color("1e5e3a"))
	draw_rect(Rect2(position + Vector2(7, 3), Vector2(18, 15)), Color("2b7a49"))
	draw_rect(Rect2(position + Vector2(3, 15), Vector2(8, 8)), Color("3b9257"))

func _draw_player() -> void:
	var origin := player_pos - PLAYER_SIZE * 0.5
	var step_offset := 0.0
	if touch_direction != Vector2.ZERO or Input.is_key_pressed(KEY_LEFT) or Input.is_key_pressed(KEY_RIGHT) or Input.is_key_pressed(KEY_UP) or Input.is_key_pressed(KEY_DOWN) or Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_S):
		step_offset = 1.0 if int(Time.get_ticks_msec() / 140) % 2 == 0 else -1.0
	origin.y += step_offset

	draw_rect(Rect2(origin + Vector2(2, 20), Vector2(14, 4)), Color(0.08, 0.12, 0.10, 0.45))
	draw_rect(Rect2(origin + Vector2(4, 1), Vector2(10, 8)), Color("e8c39e"))
	draw_rect(Rect2(origin + Vector2(2, 8), Vector2(14, 11)), Color("283d63"))
	draw_rect(Rect2(origin + Vector2(4, 19), Vector2(4, 5)), Color("1a273b"))
	draw_rect(Rect2(origin + Vector2(10, 19), Vector2(4, 5)), Color("1a273b"))

	var eye_offset := Vector2.ZERO
	if absf(facing.x) > absf(facing.y):
		eye_offset.x = signf(facing.x)
	elif facing.y < 0:
		eye_offset.y = -1.0
	else:
		eye_offset.y = 1.0
	draw_rect(Rect2(origin + Vector2(8, 4) + eye_offset, Vector2(2, 2)), Color("17202a"))

func _draw_hud() -> void:
	draw_rect(Rect2(Vector2(0, 0), Vector2(BASE_SIZE.x, WORLD_TOP)), Color("182432"))
	draw_rect(Rect2(Vector2(0, WORLD_BOTTOM), Vector2(BASE_SIZE.x, BASE_SIZE.y - WORLD_BOTTOM)), Color("182432"))
	draw_string(ThemeDB.fallback_font, Vector2(18, 29), "MONSTER LEGACY", HORIZONTAL_ALIGNMENT_LEFT, -1, 18, Color("f5f0df"))
	draw_string(ThemeDB.fallback_font, Vector2(18, 51), "PIXEL VERTICAL SLICE v0.2", HORIZONTAL_ALIGNMENT_LEFT, -1, 11, Color("9fb5c6"))
	draw_string(ThemeDB.fallback_font, Vector2(178, 732), "EXPLORE THE TALL GRASS", HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color("f5f0df"))
	draw_string(ThemeDB.fallback_font, Vector2(178, 754), "Encounter after a short step-in", HORIZONTAL_ALIGNMENT_LEFT, -1, 10, Color("9fb5c6"))
	draw_string(ThemeDB.fallback_font, Vector2(178, 775), "Touch / Arrow keys / WASD", HORIZONTAL_ALIGNMENT_LEFT, -1, 10, Color("9fb5c6"))

func _draw_dpad() -> void:
	var base := Color("26394d")
	var active := Color("415f7a")
	draw_rect(Rect2(D_PAD_CENTER + Vector2(-18, -60), Vector2(36, 120)), base)
	draw_rect(Rect2(D_PAD_CENTER + Vector2(-60, -18), Vector2(120, 36)), base)
	if touch_direction != Vector2.ZERO:
		var highlight := D_PAD_CENTER + touch_direction * 33.0 - Vector2(18, 18)
		draw_rect(Rect2(highlight, Vector2(36, 36)), active)
	draw_rect(Rect2(D_PAD_CENTER - Vector2(9, 9), Vector2(18, 18)), Color("111a24"))

func _draw_transition() -> void:
	var progress := clampf(transition_time / 0.72, 0.0, 1.0)
	for i in range(9):
		var stripe_h := 96.0
		var offset := (1.0 - progress) * BASE_SIZE.x
		var x := -offset if i % 2 == 0 else offset
		draw_rect(Rect2(Vector2(x, i * stripe_h), Vector2(BASE_SIZE.x, stripe_h + 2.0)), Color("111821"))
	if progress > 0.55:
		draw_string(ThemeDB.fallback_font, Vector2(132, 424), "ENCOUNTER", HORIZONTAL_ALIGNMENT_LEFT, -1, 20, Color("f5f0df"))

func _draw_battle() -> void:
	draw_rect(Rect2(Vector2.ZERO, BASE_SIZE), Color("101820"))
	draw_rect(Rect2(Vector2(0, 0), Vector2(BASE_SIZE.x, 66)), Color("182432"))
	draw_string(ThemeDB.fallback_font, Vector2(18, 29), "MONSTER LEGACY", HORIZONTAL_ALIGNMENT_LEFT, -1, 18, Color("f5f0df"))
	draw_string(ThemeDB.fallback_font, Vector2(18, 51), "BATTLE / TURN %d / NEXT LOCKED" % turn_index, HORIZONTAL_ALIGNMENT_LEFT, -1, 11, Color("9fb5c6"))

	# Arena: layered pixel bands, intentionally simple until official tiles are bound.
	draw_rect(Rect2(Vector2(0, 66), Vector2(390, 406)), Color("9ec6cf"))
	draw_rect(Rect2(Vector2(0, 256), Vector2(390, 216)), Color("7fa46f"))
	draw_rect(Rect2(Vector2(0, 372), Vector2(390, 100)), Color("54724f"))
	draw_ellipse_shadow(Vector2(284, 236), Vector2(54, 12))
	draw_ellipse_shadow(Vector2(96, 394), Vector2(66, 14))

	_draw_enemy_pixel_monster(Vector2(282, 191))
	_draw_player_pixel_monster(Vector2(92, 338))
	_draw_battle_panels()
	_draw_battle_buttons()

func draw_ellipse_shadow(center: Vector2, radius: Vector2) -> void:
	# Pixel-friendly stepped ellipse without textures.
	for y in range(-int(radius.y), int(radius.y) + 1, 3):
		var normalized := float(y) / maxf(1.0, radius.y)
		var half_w := int(radius.x * sqrt(maxf(0.0, 1.0 - normalized * normalized)))
		draw_rect(Rect2(center + Vector2(-half_w, y), Vector2(half_w * 2, 3)), Color(0.12, 0.18, 0.16, 0.34))

func _draw_enemy_pixel_monster(center: Vector2) -> void:
	var bob := sin(battle_time * 4.0) * 2.0
	var o := center + Vector2(-34, -34 + bob)
	var body_color := Color("f27844") if enemy_flash <= 0.0 else Color("fff3d7")
	# Temporary block sprite: silhouette only, never canonical art.
	draw_rect(Rect2(o + Vector2(10, 18), Vector2(45, 32)), body_color)
	draw_rect(Rect2(o + Vector2(34, 8), Vector2(24, 22)), body_color)
	draw_rect(Rect2(o + Vector2(6, 42), Vector2(14, 18)), body_color)
	draw_rect(Rect2(o + Vector2(42, 44), Vector2(12, 19)), body_color)
	draw_rect(Rect2(o + Vector2(0, 28), Vector2(14, 10)), Color("d65332"))
	draw_rect(Rect2(o + Vector2(53, 12), Vector2(5, 5)), Color("1d2024"))
	draw_rect(Rect2(o + Vector2(18, 12), Vector2(16, 10)), Color("f5bd43"))
	draw_rect(Rect2(o + Vector2(14, 8), Vector2(7, 7)), Color("ffdf59"))

func _draw_player_pixel_monster(center: Vector2) -> void:
	var bob := sin(battle_time * 3.1 + 1.7) * 1.5
	var o := center + Vector2(-36, -36 + bob)
	var body_color := Color("5b77b8") if player_flash <= 0.0 else Color("fff3d7")
	draw_rect(Rect2(o + Vector2(12, 17), Vector2(43, 34)), body_color)
	draw_rect(Rect2(o + Vector2(2, 11), Vector2(27, 20)), body_color)
	draw_rect(Rect2(o + Vector2(47, 13), Vector2(18, 13)), Color("7694d1"))
	draw_rect(Rect2(o + Vector2(13, 47), Vector2(13, 18)), Color("374b79"))
	draw_rect(Rect2(o + Vector2(43, 47), Vector2(13, 18)), Color("374b79"))
	draw_rect(Rect2(o + Vector2(8, 16), Vector2(5, 5)), Color("f6f1dc"))

func _draw_battle_panels() -> void:
	# Enemy status.
	draw_rect(Rect2(Vector2(20, 86), Vector2(210, 67)), Color("f4eedb"))
	draw_rect(Rect2(Vector2(25, 91), Vector2(200, 57)), Color("21313e"), false, 3.0)
	draw_string(ThemeDB.fallback_font, Vector2(34, 112), "SP-001 FIRE LIZARD", HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color("1d2730"))
	_draw_hp_bar(Vector2(34, 126), 176.0, enemy_hp, Color("dd6b46"))

	# Player status.
	draw_rect(Rect2(Vector2(164, 377), Vector2(206, 79)), Color("f4eedb"))
	draw_rect(Rect2(Vector2(169, 382), Vector2(196, 69)), Color("21313e"), false, 3.0)
	draw_string(ThemeDB.fallback_font, Vector2(180, 405), "PARTY LEAD", HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color("1d2730"))
	_draw_hp_bar(Vector2(180, 419), 166.0, player_hp, Color("5b77b8"))
	draw_string(ThemeDB.fallback_font, Vector2(180, 444), "COMMAND %d/2   STANCE %s" % [command_points, "ON" if stance_guard else "READY"], HORIZONTAL_ALIGNMENT_LEFT, -1, 10, Color("344b5e"))

	# Message box.
	draw_rect(Rect2(Vector2(18, 488), Vector2(354, 166)), Color("f4eedb"))
	draw_rect(Rect2(Vector2(24, 494), Vector2(342, 154)), Color("21313e"), false, 3.0)
	draw_string(ThemeDB.fallback_font, Vector2(36, 523), battle_message, HORIZONTAL_ALIGNMENT_LEFT, 318, 12, Color("1d2730"))
	draw_string(ThemeDB.fallback_font, Vector2(36, 618), "Prototype grammar: 2 COMMAND + remaining STANCE", HORIZONTAL_ALIGNMENT_LEFT, -1, 10, Color("66727a"))

func _draw_hp_bar(position: Vector2, width: float, hp: int, fill: Color) -> void:
	draw_rect(Rect2(position, Vector2(width, 9)), Color("2c3438"))
	var ratio := clampf(float(hp) / 100.0, 0.0, 1.0)
	draw_rect(Rect2(position + Vector2(2, 2), Vector2((width - 4.0) * ratio, 5)), fill)

func _draw_battle_buttons() -> void:
	_draw_button(ATTACK_BUTTON, "COMMAND", "Strike / key 1", Color("874b38"))
	_draw_button(STANCE_BUTTON, "STANCE", "Guard resonance / key 2", Color("385d6c"))
	_draw_button(NEXT_BUTTON, "NEXT TURN", "Enemy acts", Color("4d6647"))
	_draw_button(RUN_BUTTON, "RUN", "Return to field", Color("4c4e59"))

func _draw_button(rect: Rect2, title: String, subtitle: String, fill: Color) -> void:
	draw_rect(rect, fill)
	draw_rect(Rect2(rect.position + Vector2(4, 4), rect.size - Vector2(8, 8)), Color("f1e7cc"), false, 2.0)
	draw_string(ThemeDB.fallback_font, rect.position + Vector2(12, 23), title, HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color("fff7e6"))
	draw_string(ThemeDB.fallback_font, rect.position + Vector2(12, 41), subtitle, HORIZONTAL_ALIGNMENT_LEFT, -1, 9, Color("e0d7c5"))
