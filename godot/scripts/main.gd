extends Node2D

const BASE_SIZE := Vector2(390.0, 844.0)
const WORLD_TOP := 64.0
const WORLD_BOTTOM := 676.0
const PLAYER_SIZE := Vector2(18.0, 24.0)
const MOVE_SPEED := 118.0
const D_PAD_CENTER := Vector2(72.0, 756.0)
const D_PAD_RADIUS := 66.0

var player_pos := Vector2(195.0, 500.0)
var touch_direction := Vector2.ZERO
var active_touch := false
var facing := Vector2.DOWN

func _ready() -> void:
	texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	queue_redraw()

func _process(delta: float) -> void:
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

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			active_touch = true
			touch_direction = _touch_direction(event.position)
		else:
			active_touch = false
			touch_direction = Vector2.ZERO
		queue_redraw()
	elif event is InputEventScreenDrag and active_touch:
		touch_direction = _touch_direction(event.position)
		queue_redraw()

func _touch_direction(position: Vector2) -> Vector2:
	var delta := position - D_PAD_CENTER
	if delta.length() > D_PAD_RADIUS:
		return Vector2.ZERO
	if absf(delta.x) > absf(delta.y):
		return Vector2(signf(delta.x), 0.0)
	if absf(delta.y) > 8.0:
		return Vector2(0.0, signf(delta.y))
	return Vector2.ZERO

func _draw() -> void:
	_draw_background()
	_draw_field_details()
	_draw_player()
	_draw_hud()
	_draw_dpad()

func _draw_background() -> void:
	draw_rect(Rect2(Vector2.ZERO, BASE_SIZE), Color("101820"))
	draw_rect(Rect2(Vector2(0.0, WORLD_TOP), Vector2(BASE_SIZE.x, WORLD_BOTTOM - WORLD_TOP)), Color("5f8f4f"))

	# 24 px tile rhythm to establish the future pixel-art grid.
	for y in range(int(WORLD_TOP), int(WORLD_BOTTOM), 24):
		for x in range(0, int(BASE_SIZE.x), 24):
			var alternate := ((x / 24) + (y / 24)) as int
			if alternate % 2 == 0:
				draw_rect(Rect2(Vector2(x, y), Vector2(24, 24)), Color("648f51"))

	# Main route.
	draw_rect(Rect2(Vector2(148.0, WORLD_TOP), Vector2(94.0, WORLD_BOTTOM - WORLD_TOP)), Color("c7ad72"))
	draw_rect(Rect2(Vector2(154.0, WORLD_TOP), Vector2(82.0, WORLD_BOTTOM - WORLD_TOP)), Color("d8c386"))

func _draw_field_details() -> void:
	# Trees: deliberately simple generated placeholders. Locked official art will replace these.
	for position in [Vector2(26, 106), Vector2(72, 150), Vector2(294, 122), Vector2(330, 180), Vector2(38, 340), Vector2(305, 370), Vector2(42, 566), Vector2(318, 548)]:
		_draw_tree(position)

	# Grass encounter patches.
	for position in [Vector2(92, 250), Vector2(278, 270), Vector2(78, 454), Vector2(284, 468)]:
		for row in range(3):
			for col in range(3):
				var p := position + Vector2(col * 12, row * 10)
				draw_line(p + Vector2(0, 8), p + Vector2(4, 0), Color("234d2d"), 2.0)
				draw_line(p + Vector2(4, 8), p + Vector2(8, 0), Color("2c6136"), 2.0)

func _draw_tree(position: Vector2) -> void:
	draw_rect(Rect2(position + Vector2(11, 26), Vector2(10, 18)), Color("6b4726"))
	draw_rect(Rect2(position + Vector2(2, 10), Vector2(28, 24)), Color("1e5e3a"))
	draw_rect(Rect2(position + Vector2(7, 3), Vector2(18, 15)), Color("2b7a49"))
	draw_rect(Rect2(position + Vector2(3, 15), Vector2(8, 8)), Color("3b9257"))

func _draw_player() -> void:
	var origin := player_pos - PLAYER_SIZE * 0.5
	# Shadow.
	draw_rect(Rect2(origin + Vector2(2, 20), Vector2(14, 4)), Color(0.08, 0.12, 0.10, 0.45))
	# Body / head / accent blocks. These are placeholders, not final character art.
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
	draw_string(ThemeDB.fallback_font, Vector2(18, 51), "GODOT PIXEL VERTICAL SLICE v0.1", HORIZONTAL_ALIGNMENT_LEFT, -1, 11, Color("9fb5c6"))
	draw_string(ThemeDB.fallback_font, Vector2(178, 742), "FIELD MOVEMENT", HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color("f5f0df"))
	draw_string(ThemeDB.fallback_font, Vector2(178, 765), "Touch D-pad / Arrow keys / WASD", HORIZONTAL_ALIGNMENT_LEFT, -1, 11, Color("9fb5c6"))

func _draw_dpad() -> void:
	var base := Color("26394d")
	var active := Color("415f7a")
	draw_rect(Rect2(D_PAD_CENTER + Vector2(-18, -60), Vector2(36, 120)), base)
	draw_rect(Rect2(D_PAD_CENTER + Vector2(-60, -18), Vector2(120, 36)), base)
	if touch_direction != Vector2.ZERO:
		var highlight := D_PAD_CENTER + touch_direction * 33.0 - Vector2(18, 18)
		draw_rect(Rect2(highlight, Vector2(36, 36)), active)
	draw_rect(Rect2(D_PAD_CENTER - Vector2(9, 9), Vector2(18, 18)), Color("111a24"))
