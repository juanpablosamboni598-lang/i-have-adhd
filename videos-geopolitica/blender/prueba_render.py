"""Prueba de calidad/velocidad: escena estilo 'dibujado' (papel + tinta) en Blender.
Uso: bpy-venv/bin/python prueba_render.py <motor: CYCLES|EEVEE|WORKBENCH> <salida.png> [muestras]"""
import bpy, sys, time, math
eng, out = sys.argv[1], sys.argv[2]; spp = int(sys.argv[3]) if len(sys.argv) > 3 else 32
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = 1080, 1920, 100

def mat(name, color, rough=0.6, metal=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; b = nt.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    # grano de papel: ruido que oscurece un poco el color (look acuarela)
    n = nt.nodes.new('ShaderNodeTexNoise'); n.inputs['Scale'].default_value = 180; n.inputs['Detail'].default_value = 8
    mix = nt.nodes.new('ShaderNodeMixRGB'); mix.blend_type = 'MULTIPLY'; mix.inputs['Fac'].default_value = 0.18
    mix.inputs['Color1'].default_value = (*color, 1); nt.links.new(n.outputs['Fac'], mix.inputs['Color2'])
    nt.links.new(mix.outputs['Color'], b.inputs['Base Color']); return m

def add(obj, m, bevel=0.0):
    obj.data.materials.append(m)
    if bevel:
        bv = obj.modifiers.new('bv', 'BEVEL'); bv.width = bevel; bv.segments = 3
    bpy.ops.object.shade_smooth() if hasattr(bpy.ops.object, 'shade_smooth') else None
    return obj

# pared de azulejos verdes y mesada
bpy.ops.mesh.primitive_plane_add(size=6, location=(0, 1.2, 1.5), rotation=(math.pi/2, 0, 0)); add(bpy.context.object, mat('pared', (0.62, 0.86, 0.74), 0.9))
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.45)); o = bpy.context.object; o.scale = (2.2, 1.2, 0.9); add(o, mat('mesada', (0.93, 0.93, 0.92), 0.5), 0.03)
# estufa
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 1.0)); o = bpy.context.object; o.scale = (1.2, 0.8, 0.18); add(o, mat('estufa', (0.9, 0.9, 0.9), 0.4), 0.02)
# olla de aluminio con tapa y mango
bpy.ops.mesh.primitive_cylinder_add(radius=0.35, depth=0.42, location=(0, 0, 1.31), vertices=64); add(bpy.context.object, mat('olla', (0.8, 0.82, 0.85), 0.25, 0.8), 0.01)
bpy.ops.mesh.primitive_cylinder_add(radius=0.37, depth=0.03, location=(0, 0, 1.53), vertices=64); add(bpy.context.object, mat('tapa', (0.82, 0.84, 0.87), 0.25, 0.8), 0.01)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.05, location=(0, 0, 1.57)); add(bpy.context.object, mat('perilla', (0.08, 0.08, 0.08), 0.5))
# boquilla de latón (hexágono + cono)
bpy.ops.mesh.primitive_cylinder_add(radius=0.07, depth=0.08, vertices=6, location=(0.55, -0.25, 1.13)); add(bpy.context.object, mat('laton', (0.85, 0.68, 0.3), 0.35, 0.9), 0.006)
bpy.ops.mesh.primitive_cone_add(radius1=0.05, radius2=0.02, depth=0.06, location=(0.55, -0.25, 1.2), vertices=48); add(bpy.context.object, mat('laton2', (0.85, 0.68, 0.3), 0.35, 0.9))
# luz de sol fuerte de lado (sombras largas) + cielo suave
bpy.ops.object.light_add(type='SUN', rotation=(math.radians(50), math.radians(25), math.radians(-35))); s = bpy.context.object.data; s.energy = 4.0; s.angle = math.radians(2)
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.75, 0.8, 0.85, 1); w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.6
# cámara vertical
bpy.ops.object.camera_add(location=(1.4, -2.6, 2.2), rotation=(math.radians(68), 0, math.radians(28))); sc.camera = bpy.context.object; bpy.context.object.data.lens = 35
# contornos de tinta (Freestyle)
sc.render.use_freestyle = True; fs = bpy.context.view_layer.freestyle_settings
lset = fs.linesets[0] if len(fs.linesets) else fs.linesets.new('tinta')
if lset.linestyle is None: lset.linestyle = bpy.data.linestyles.new('tinta')
lset.linestyle.thickness = 2.2; lset.linestyle.color = (0.08, 0.08, 0.1)
sc.view_settings.view_transform = 'Standard'
if eng == 'CYCLES':
    sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = spp; sc.cycles.use_adaptive_sampling = True
    sc.cycles.use_denoising = True; sc.cycles.denoiser = 'OPENIMAGEDENOISE'; sc.cycles.max_bounces = 4
elif eng == 'EEVEE':
    sc.render.engine = 'BLENDER_EEVEE' if 'BLENDER_EEVEE' in [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items] else 'BLENDER_EEVEE_NEXT'
else:
    sc.render.engine = 'BLENDER_WORKBENCH'
sc.render.filepath = out
t = time.time(); bpy.ops.render.render(write_still=True); print(f'MOTOR {eng} {sc.render.engine} tiempo {time.time()-t:.1f} s')
