extends Node2D

const BASE_SIZE := Vector2(390.0, 844.0)
const WORLD_TOP := 64.0
const WORLD_BOTTOM := 676.0
const MOVE_SPEED := 118.0
const D_PAD_CENTER := Vector2(72.0, 756.0)
const D_PAD_RADIUS := 66.0

const MODE_FIELD := 0
const MODE_TRANSITION := 1
const MODE_BATTLE := 2

const GRASS_AREAS := [
	Rect2(84.0, 234.0, 56.0, 56.0),
	Rect2(266.0, 256.0, 58.0, 58.0),
	Rect2(66.0, 438.0, 58.0, 58.0),
	Rect2(274.0, 454.0, 58.0, 58.0)
]

const COMMAND_BUTTON := Rect2(24.0, 684.0, 164.0, 58.0)
const STANCE_BUTTON := Rect2(202.0, 684.0, 164.0, 58.0)
const NEXT_BUTTON := Rect2(24.0, 752.0, 164.0, 48.0)
const RUN_BUTTON := Rect2(202.0, 752.0, 164.0, 48.0)

var mode := MODE_FIELD
var player_pos := Vector2(195.0, 520.0)
var facing := Vector2.DOWN
var moving := false
var touch_direction := Vector2.ZERO
var active_touch := false
var field_time := 0.0
var grass_dwell := 0.0
var encounter_cooldown := 0.0

var transition_time := 0.0
var battle_time := 0.0
var turn_index := 1
var command_points := 2
var stance_guard := false
var enemy_hp := 100
var player_hp := 100
var battle_message := "A wild presence answers the resonance."

var player_attack_timer := 0.0
var enemy_attack_timer := 0.0
var player_attack_applied := false
var enemy_attack_applied := false
var enemy_flash := 0.0
var player_flash := 0.0
var hitstop_timer := 0.0
var shake_timer := 0.0
var ko_timer := 0.0
var particles: Array = []

func _ready() -> void:
	texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	queue_redraw()

func _process(delta: float) -> void:
	encounter_cooldown = maxf(0.0, encounter_cooldown - delta)
	enemy_flash = maxf(0.0, enemy_flash - delta)
	player_flash = maxf(0.0, player_flash - delta)
	shake_timer = maxf(0.0, shake_timer - delta)
	_update_particles(delta)

	if hitstop_timer > 0.0:
		hitstop_timer = maxf(0.0, hitstop_timer - delta)
		queue_redraw()
		return

	if mode == MODE_FIELD:
		field_time += delta
		_process_field(delta)
	elif mode == MODE_TRANSITION:
		transition_time += delta
		if transition_time >= 0.72:
			_begin_battle()
		queue_redraw()
	elif mode == MODE_BATTLE:
		battle_time += delta
		_process_battle(delta)
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

	moving = direction != Vector2.ZERO
	if moving:
		facing = direction
		player_pos += direction * MOVE_SPEED * delta
		player_pos.x = clampf(player_pos.x, 26.0, BASE_SIZE.x - 26.0)
		player_pos.y = clampf(player_pos.y, WORLD_TOP + 28.0, WORLD_BOTTOM - 30.0)

	if _player_in_grass() and encounter_cooldown <= 0.0 and moving:
		grass_dwell += delta
		if grass_dwell >= 0.40:
			_start_transition()
	else:
		grass_dwell = maxf(0.0, grass_dwell - delta * 3.0)
	queue_redraw()

func _process_battle(delta: float) -> void:
	if player_attack_timer > 0.0:
		player_attack_timer = maxf(0.0, player_attack_timer - delta)
		var p := 1.0 - player_attack_timer / 0.34
		if p >= 0.43 and not player_attack_applied:
			player_attack_applied = true
			_apply_player_attack()
	elif enemy_attack_timer > 0.0:
		enemy_attack_timer = maxf(0.0, enemy_attack_timer - delta)
		var p := 1.0 - enemy_attack_timer / 0.40
		if p >= 0.48 and not enemy_attack_applied:
			enemy_attack_applied = true
			_apply_enemy_attack()

	if enemy_hp <= 0:
		ko_timer += delta
		if ko_timer > 0.85:
			battle_message = "FIRE LIZARD yields. Tap COMMAND to return."

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_handle_pointer_down(event.position)
		else:
			active_touch = false
			touch_direction = Vector2.ZERO
	elif event is InputEventScreenDrag and active_touch and mode == MODE_FIELD:
		touch_direction = _touch_direction(event.position)
	elif event is InputEventMouseButton and event.pressed:
		_handle_pointer_down(event.position)
	elif event is InputEventKey and event.pressed and mode == MODE_BATTLE:
		if event.keycode == KEY_1 or event.keycode == KEY_SPACE:
			_battle_command()
		elif event.keycode == KEY_2:
			_battle_stance()
		elif event.keycode == KEY_ENTER:
			_advance_turn()
		elif event.keycode == KEY_ESCAPE:
			_leave_battle("You withdrew from the encounter.")
	queue_redraw()

func _handle_pointer_down(position: Vector2) -> void:
	if mode == MODE_FIELD:
		active_touch = true
		touch_direction = _touch_direction(position)
	elif mode == MODE_BATTLE:
		if COMMAND_BUTTON.has_point(position):
			_battle_command()
		elif STANCE_BUTTON.has_point(position):
			_battle_stance()
		elif NEXT_BUTTON.has_point(position):
			_advance_turn()
		elif RUN_BUTTON.has_point(position):
			_leave_battle("You withdrew from the encounter.")

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
	moving = false
	touch_direction = Vector2.ZERO
	active_touch = false
	queue_redraw()

func _begin_battle() -> void:
	mode = MODE_BATTLE
	battle_time = 0.0
	turn_index = 1
	command_points = 2
	stance_guard = false
	enemy_hp = 100
	player_hp = 100
	player_attack_timer = 0.0
	enemy_attack_timer = 0.0
	ko_timer = 0.0
	particles.clear()
	battle_message = "SP-001 FIRE LIZARD blocks the path!"
	queue_redraw()

func _battle_busy() -> bool:
	return player_attack_timer > 0.0 or enemy_attack_timer > 0.0 or hitstop_timer > 0.0

func _battle_command() -> void:
	if mode != MODE_BATTLE or _battle_busy():
		return
	if enemy_hp <= 0:
		_leave_battle("The resonance settled. Encounter complete.")
		return
	if command_points <= 0:
		battle_message = "No COMMAND remains. Advance the turn."
		return
	command_points -= 1
	player_attack_timer = 0.34
	player_attack_applied = false
	battle_message = "PARTY LEAD moves!"

func _apply_player_attack() -> void:
	var damage := 28 if turn_index == 1 else 22
	enemy_hp = maxi(0, enemy_hp - damage)
	enemy_flash = 0.14
	hitstop_timer = 0.055
	shake_timer = 0.18
	_spawn_hit_particles(Vector2(281, 194), Color("ffd36a"))
	battle_message = "COMMAND hits for %d. FIRE LIZARD staggers." % damage
	if enemy_hp <= 0:
		ko_timer = 0.0
		battle_message = "A clean hit! FIRE LIZARD loses its footing."

func _battle_stance() -> void:
	if mode != MODE_BATTLE or _battle_busy() or enemy_hp <= 0:
		return
	if stance_guard:
		battle_message = "STANCE is already active this turn."
		return
	stance_guard = true
	battle_message = "STANCE: Guard Resonance. Incoming damage is reduced."

func _advance_turn() -> void:
	if mode != MODE_BATTLE or _battle_busy() or enemy_hp <= 0 or player_hp <= 0:
		return
	enemy_attack_timer = 0.40
	enemy_attack_applied = false
	battle_message = "FIRE LIZARD reads your stance..."

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
	battle_message = "Enemy strikes for %d. Turn %d begins." % [incoming, turn_index]
	if player_hp <= 0:
		battle_message = "The party falls back. Tap RUN to return to the field."

func _leave_battle(message: String) -> void:
	mode = MODE_FIELD
	encounter_cooldown = 1.8
	grass_dwell = 0.0
	battle_message = message
	player_pos.y = minf(WORLD_BOTTOM - 40.0, player_pos.y + 34.0)
	particles.clear()
	queue_redraw()

func _spawn_hit_particles(origin: Vector2, color: Color) -> void:
	for i in range(10):
		var angle := TAU * float(i) / 10.0
		var speed := 42.0 + float((i % 3) * 14)
		particles.append({
			"pos": origin,
			"vel": Vector2(cos(angle), sin(angle)) * speed,
			"life": 0.32 + float(i % 2) * 0.08,
			"color": color
		})

func _update_particles(delta: float) -> void:
	for i in range(particles.size() - 1, -1, -1):
		var particle = particles[i]
		particle["life"] = float(particle["life"]) - delta
		particle["pos"] = Vector2(particle["pos"]) + Vector2(particle["vel"]) * delta
		particle["vel"] = Vector2(particle["vel"]) * 0.90
		particles[i] = particle
		if float(particle["life"]) <= 0.0:
			particles.remove_at(i)

func _draw() -> void:
	if mode == MODE_BATTLE:
		_draw_battle()
	else:
		_draw_field()
		if mode == MODE_TRANSITION:
			_draw_transition()

func _draw_field() -> void:
	_draw_field_background()
	_draw_field_decor()
	_draw_player()
	_draw_field_hud()
	_draw_dpad()

func _draw_field_background() -> void:
	draw_rect(Rect2(Vector2.ZERO, BASE_SIZE), Color("101820"))
	draw_rect(Rect2(Vector2(0, WORLD_TOP), Vector2(BASE_SIZE.x, WORLD_BOTTOM - WORLD_TOP)), Color("648f51"))
	for y in range(int(WORLD_TOP), int(WORLD_BOTTOM), 24):
		for x in range(0, int(BASE_SIZE.x), 24):
			if (int(x / 24) + int(y / 24)) % 2 == 0:
				draw_rect(Rect2(Vector2(x, y), Vector2(24, 24)), Color("6b9856"))

	# Main road and a short side path.
	draw_rect(Rect2(Vector2(147, WORLD_TOP), Vector2(96, WORLD_BOTTOM - WORLD_TOP)), Color("bea66f"))
	draw_rect(Rect2(Vector2(154, WORLD_TOP), Vector2(82, WORLD_BOTTOM - WORLD_TOP)), Color("dbc98d"))
	draw_rect(Rect2(Vector2(105, 335), Vector2(180, 46)), Color("bea66f"))
	draw_rect(Rect2(Vector2(111, 341), Vector2(168, 34)), Color("dbc98d"))

	# Pond and bridge-like landmark for stronger exploration read.
	draw_rect(Rect2(Vector2(18, 162), Vector2(92, 54)), Color("5b95a8"))
	for y in range(170, 210, 10):
		var wave := 4.0 if int((field_time * 5.0) + y) % 2 == 0 else 0.0
		draw_rect(Rect2(Vector2(28 + wave, y), Vector2(62, 3)), Color("8bc1ca"))
	draw_rect(Rect2(Vector2(93, 176), Vector2(70, 24)), Color("8f6c43"))
	for x in range(97, 159, 12):
		draw_rect(Rect2(Vector2(x, 178), Vector2(7, 20)), Color("c3a16c"))

	# Shrine destination.
	draw_rect(Rect2(Vector2(174, 88), Vector2(42, 28)), Color("a84e40"))
	draw_rect(Rect2(Vector2(179, 116), Vector2(32, 27)), Color("efe6ca"))
	draw_rect(Rect2(Vector2(192, 121), Vector2(7, 22)), Color("5b4537"))

func _draw_field_decor() -> void:
	for position in [Vector2(22, 100), Vector2(72, 112), Vector2(296, 102), Vector2(334, 160), Vector2(30, 324), Vector2(310, 326), Vector2(38, 550), Vector2(318, 534)]:
		_draw_tree(position)

	for area in GRASS_AREAS:
		var sway := sin(field_time * 5.0 + area.position.x * 0.03) * 2.0
		for row in range(5):
			for col in range(5):
				var p := area.position + Vector2(4 + col * 10, 5 + row * 10)
				var local_sway := sway * (1.0 if (row + col) % 2 == 0 else -1.0)
				draw_line(p + Vector2(1, 8), p + Vector2(4 + local_sway, 0), Color("214c2d"), 2.0)
				draw_line(p + Vector2(5, 8), p + Vector2(8 - local_sway, 1), Color("2d6539"), 2.0)

	# Small signpost.
	draw_rect(Rect2(Vector2(248, 396), Vector2(6, 30)), Color("6c492e"))
	draw_rect(Rect2(Vector2(238, 392), Vector2(27, 14)), Color("b78a55"))
	draw_rect(Rect2(Vector2(242, 396), Vector2(18, 2)), Color("5d422f"))

func _draw_tree(position: Vector2) -> void:
	var sway := sin(field_time * 1.7 + position.x * 0.04) * 1.0
	draw_rect(Rect2(position + Vector2(11, 27), Vector2(10, 18)), Color("6b4726"))
	draw_rect(Rect2(position + Vector2(2 + sway, 11), Vector2(28, 24)), Color("1e5e3a"))
	draw_rect(Rect2(position + Vector2(7 - sway, 3), Vector2(18, 16)), Color("2b7a49"))
	draw_rect(Rect2(position + Vector2(3 + sway, 16), Vector2(8, 8)), Color("3b9257"))

func _draw_player() -> void:
	var frame := int(field_time * 8.0) % 4 if moving else 0
	var bounce := -1.0 if moving and frame % 2 == 1 else 0.0
	var leg_swap := moving and frame >= 2
	var o := player_pos + Vector2(-9, -12 + bounce)

	draw_rect(Rect2(o + Vector2(2, 21), Vector2(14, 4)), Color(0.08, 0.12, 0.10, 0.45))
	draw_rect(Rect2(o + Vector2(4, 1), Vector2(10, 8)), Color("e8c39e"))
	draw_rect(Rect2(o + Vector2(2, 8), Vector2(14, 11)), Color("243d63"))
	draw_rect(Rect2(o + Vector2(5 if leg_swap else 3, 19), Vector2(4, 5)), Color("17273b"))
	draw_rect(Rect2(o + Vector2(9 if leg_swap else 11, 19), Vector2(4, 5)), Color("17273b"))
	# Backpack/accent reads differently by direction without pretending to be final art.
	if facing.y > 0.5:
		draw_rect(Rect2(o + Vector2(3, 10), Vector2(3, 7)), Color("9f5f3b"))
	elif facing.y < -0.5:
		draw_rect(Rect2(o + Vector2(6, 9), Vector2(7, 7)), Color("9f5f3b"))
	else:
		draw_rect(Rect2(o + Vector2(2 if facing.x < 0 else 13, 10), Vector2(3, 7)), Color("9f5f3b"))

	var eye := Vector2(8, 4)
	if absf(facing.x) > absf(facing.y):
		eye.x += signf(facing.x)
	elif facing.y < 0:
		eye.y -= 1
	else:
		eye.y += 1
	draw_rect(Rect2(o + eye, Vector2(2, 2)), Color("17202a"))

func _draw_field_hud() -> void:
	draw_rect(Rect2(Vector2.ZERO, Vector2(BASE_SIZE.x, WORLD_TOP)), Color("182432"))
	draw_rect(Rect2(Vector2(0, WORLD_BOTTOM), Vector2(BASE_SIZE.x, BASE_SIZE.y - WORLD_BOTTOM)), Color("182432"))
	draw_string(ThemeDB.fallback_font, Vector2(18, 29), "MONSTER LEGACY", HORIZONTAL_ALIGNMENT_LEFT, -1, 18, Color("f5f0df"))
	draw_string(ThemeDB.fallback_font, Vector2(18, 51), "PIXEL VERTICAL SLICE v0.3", HORIZONTAL_ALIGNMENT_LEFT, -1, 11, Color("9fb5c6"))
	draw_string(ThemeDB.fallback_font, Vector2(178, 733), "ROUTE 01 / RESONANCE GROVE", HORIZONTAL_ALIGNMENT_LEFT, -1, 12, Color("f5f0df"))
	draw_string(ThemeDB.fallback_font, Vector2(178, 755), "Tall grass can answer back", HORIZONTAL_ALIGNMENT_LEFT, -1, 10, Color("9fb5c6"))
	draw_string(ThemeDB.fallback_font, Vector2(178, 777), "Touch / Arrow keys / WASD", HORIZONTAL_ALIGNMENT_LEFT, -1, 10, Color("9fb5c6"))

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
	var p := clampf(transition_time / 0.72, 0.0, 1.0)
	for i in range(10):
		var stripe_h := 86.0
		var offset := (1.0 - p) * BASE_SIZE.x
		var x := -offset if i % 2 == 0 else offset
		draw_rect(Rect2(Vector2(x, i * stripe_h), Vector2(BASE_SIZE.x, stripe_h + 2)), Color("111821"))
	if p > 0.50:
		var pulse := 1.0 + sin(transition_time * 30.0) * 0.04
		draw_string(ThemeDB.fallback_font, Vector2(124, 421), "RESONANCE", HORIZONTAL_ALIGNMENT_LEFT, -1, int(20 * pulse), Color("f5f0df"))

func _draw_battle() -> void:
	draw_rect(Rect2(Vector2.ZERO, BASE_SIZE), Color("101820"))
	draw_rect(Rect2(Vector2(0, 0), Vector2(BASE_SIZE.x, 66)), Color("182432"))
	draw_string(ThemeDB.fallback_font, Vector2(18, 29), "MONSTER LEGACY", HORIZONTAL_ALIGNMENT_LEFT, -1, 18, Color("f5f0df"))
	draw_string(ThemeDB.fallback_font, Vector2(18, 51), "BATTLE / TURN %d / NEXT LOCKED" % turn_index, HORIZONTAL_ALIGNMENT_LEFT, -1, 11, Color("9fb5c6"))

	# Pixel-band arena with animated cloud/wind bands.
	draw_rect(Rect2(Vector2(0, 66), Vector2(390, 406)), Color("9ec6cf"))
	for i in range(5):
		var cloud_x := fmod(float(i * 92) + battle_time * 9.0, 470.0) - 50.0
		draw_rect(Rect2(Vector2(cloud_x, 102 + i * 23), Vector2(44, 5)), Color(0.86, 0.94, 0.94, 0.65))
	draw_rect(Rect2(Vector2(0, 256), Vector2(390, 216)), Color("7fa46f"))
	draw_rect(Rect2(Vector2(0, 372), Vector2(390, 100)), Color("54724f"))

	var shake := _battle_shake_offset()
	var intro := clampf(battle_time / 0.42, 0.0, 1.0)
	var enemy_center := Vector2(282 + (1.0 - intro) * 54.0, 191) + shake
	var player_center := Vector2(92 - (1.0 - intro) * 54.0, 338) - shake * 0.45

	if player_attack_timer > 0.0:
		var ap := 1.0 - player_attack_timer / 0.34
		player_center.x += sin(ap * PI) * 42.0
	if enemy_attack_timer > 0.0:
		var ep := 1.0 - enemy_attack_timer / 0.40
		enemy_center.x -= sin(ep * PI) * 38.0

	_draw_ellipse_shadow(enemy_center + Vector2(2, 45), Vector2(54, 12))
	_draw_ellipse_shadow(player_center + Vector2(2, 52), Vector2(66, 14))
	_draw_enemy_pixel_monster(enemy_center)
	_draw_player_pixel_monster(player_center)
	_draw_particles()
	_draw_battle_panels()
	_draw_battle_buttons()

func _battle_shake_offset() -> Vector2:
	if shake_timer <= 0.0:
		return Vector2.ZERO
	var amp := 5.0 * clampf(shake_timer / 0.18, 0.0, 1.0)
	return Vector2(sin(battle_time * 96.0) * amp, cos(battle_time * 71.0) * amp * 0.55)

func _draw_ellipse_shadow(center: Vector2, radius: Vector2) -> void:
	for y in range(-int(radius.y), int(radius.y) + 1, 3):
		var normalized := float(y) / maxf(1.0, radius.y)
		var half_w := int(radius.x * sqrt(maxf(0.0, 1.0 - normalized * normalized)))
		draw_rect(Rect2(center + Vector2(-half_w, y), Vector2(half_w * 2, 3)), Color(0.12, 0.18, 0.16, 0.34))

func _draw_enemy_pixel_monster(center: Vector2) -> void:
	var bob := sin(battle_time * 4.0) * 2.0
	var fade := 1.0
	var drop := 0.0
	if enemy_hp <= 0:
		fade = clampf(1.0 - ko_timer / 0.75, 0.0, 1.0)
		drop = minf(24.0, ko_timer * 34.0)
	var o := center + Vector2(-34, -34 + bob + drop)
	var body := Color("f27844") if enemy_flash <= 0.0 else Color("fff3d7")
	body.a = fade
	var dark := Color("d65332", fade)
	var eye := Color("1d2024", fade)
	var crest := Color("f5bd43", fade)
	draw_rect(Rect2(o + Vector2(10, 18), Vector2(45, 32)), body)
	draw_rect(Rect2(o + Vector2(34, 8), Vector2(24, 22)), body)
	draw_rect(Rect2(o + Vector2(6, 42), Vector2(14, 18)), body)
	draw_rect(Rect2(o + Vector2(42, 44), Vector2(12, 19)), body)
	draw_rect(Rect2(o + Vector2(0, 28), Vector2(14, 10)), dark)
	draw_rect(Rect2(o + Vector2(53, 12), Vector2(5, 5)), eye)
	draw_rect(Rect2(o + Vector2(18, 12), Vector2(16, 10)), crest)
	draw_rect(Rect2(o + Vector2(14, 8), Vector2(7, 7)), Color(1.0, 0.87, 0.35, fade))

func _draw_player_pixel_monster(center: Vector2) -> void:
	var bob := sin(battle_time * 3.1 + 1.7) * 1.5
	var o := center + Vector2(-36, -36 + bob)
	var body := Color("5b77b8") if player_flash <= 0.0 else Color("fff3d7")
	draw_rect(Rect2(o + Vector2(12, 17), Vector2(43, 34)), body)
	draw_rect(Rect2(o + Vector2(2, 11), Vector2(27, 20)), body)
	draw_rect(Rect2(o + Vector2(47, 13), Vector2(18, 13)), Color("7694d1"))
	draw_rect(Rect2(o + Vector2(13, 47), Vector2(13, 18)), Color("374b79"))
	draw_rect(Rect2(o + Vector2(43, 47), Vector2(13, 18)), Color("374b79"))
	draw_rect(Rect2(o + Vector2(8, 16), Vector2(5, 5)), Color("f6f1dc"))

func _draw_particles() -> void:
	for particle in particles:
		var life := float(particle["life"])
		var alpha := clampf(life / 0.40, 0.0, 1.0)
		var color: Color = particle["color"]
		color.a = alpha
		var pos: Vector2 = particle["pos"]
		draw_rect(Rect2(pos - Vector2(2, 2), Vector2(4, 4)), color)

func _draw_battle_panels() -> void:
	draw_rect(Rect2(Vector2(20, 86), Vector2(210, 67)), Color("f4eedb"))
	draw_rect(Rect2(Vector2(25, 91), Vector2(200, 57)), Color("21313e"), false, 3.0)
	draw_string(ThemeDB.fallback_font, Vector2(34, 112), "SP-001 FIRE LIZARD", HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color("1d2730"))
	_draw_hp_bar(Vector2(34, 126), 176.0, enemy_hp, Color("dd6b46"))

	draw_rect(Rect2(Vector2(164, 377), Vector2(206, 79)), Color("f4eedb"))
	draw_rect(Rect2(Vector2(169, 382), Vector2(196, 69)), Color("21313e"), false, 3.0)
	draw_string(ThemeDB.fallback_font, Vector2(180, 405), "PARTY LEAD", HORIZONTAL_ALIGNMENT_LEFT, -1, 13, Color("1d2730"))
	_draw_hp_bar(Vector2(180, 419), 166.0, player_hp, Color("5b77b8"))
	draw_string(ThemeDB.fallback_font, Vector2(180, 444), "COMMAND %d/2   STANCE %s" % [command_points, "ON" if stance_guard else "READY"], HORIZONTAL_ALIGNMENT_LEFT, -1, 10, Color("344b5e"))

	draw_rect(Rect2(Vector2(18, 488), Vector2(354, 166)), Color("f4eedb"))
	draw_rect(Rect2(Vector2(24, 494), Vector2(342, 154)), Color("21313e"), false, 3.0)
	draw_string(ThemeDB.fallback_font, Vector2(36, 523), battle_message, HORIZONTAL_ALIGNMENT_LEFT, 318, 12, Color("1d2730"))
	draw_string(ThemeDB.fallback_font, Vector2(36, 618), "Feel pass: lunge / hit-stop / shake / particles / KO", HORIZONTAL_ALIGNMENT_LEFT, -1, 10, Color("66727a"))

func _draw_hp_bar(position: Vector2, width: float, hp: int, fill: Color) -> void:
	draw_rect(Rect2(position, Vector2(width, 9)), Color("2c3438"))
	var ratio := clampf(float(hp) / 100.0, 0.0, 1.0)
	draw_rect(Rect2(position + Vector2(2, 2), Vector2((width - 4.0) * ratio, 5)), fill)

func _draw_battle_buttons() -> void:
	var disabled := _battle_busy()
	_draw_button(COMMAND_BUTTON, "COMMAND", "Strike / key 1", Color("874b38"), disabled or command_points <= 0)
	_draw_button(STANCE_BUTTON, "STANCE", "Guard resonance / key 2", Color("385d6c"), disabled or stance_guard)
	_draw_button(NEXT_BUTTON, "NEXT TURN", "Enemy acts / Enter", Color("4d6647"), disabled or enemy_hp <= 0)
	_draw_button(RUN_BUTTON, "RUN", "Return to field", Color("4c4e59"), false)

func _draw_button(rect: Rect2, title: String, subtitle: String, fill: Color, disabled: bool) -> void:
	var surface := fill.darkened(0.35) if disabled else fill
	draw_rect(rect, surface)
	draw_rect(Rect2(rect.position + Vector2(4, 4), rect.size - Vector2(8, 8)), Color("f1e7cc"), false, 2.0)
	var title_color := Color("b8b2a7") if disabled else Color("fff7e6")
	var sub_color := Color("8d8b86") if disabled else Color("e0d7c5")
	draw_string(ThemeDB.fallback_font, rect.position + Vector2(12, 23), title, HORIZONTAL_ALIGNMENT_LEFT, -1, 13, title_color)
	draw_string(ThemeDB.fallback_font, rect.position + Vector2(12, 41), subtitle, HORIZONTAL_ALIGNMENT_LEFT, -1, 9, sub_color)
