import json,sys,base64,os
out=sys.argv[1]; os.makedirs(out,exist_ok=True); tot=0
for i,f in enumerate(sys.argv[2:]):
    raw=open(f).read()
    try: d=json.loads(raw)
    except: d=json.loads(json.loads(raw)[0]['text'])
    open(f'{out}/a{i:02d}.wav','wb').write(base64.b64decode(d['audio_base64']))
    tot+=d['duration_seconds']
print(len(sys.argv)-2,'partes',round(tot,1),'s')
