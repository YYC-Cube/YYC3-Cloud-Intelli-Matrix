import re

with open('src/app/components/UnifiedSettingsPanel.tsx', 'r') as f:
    content = f.read()

# Remaining text-sm patterns
content = content.replace(
    'className="text-sm text-[rgba(0,180,255,0.6)] mb-4"',
    'className="text-[rgba(0,212,255,0.35)] mb-3" style={{ fontSize: "0.7rem" }}'
)
content = content.replace(
    'className="text-sm text-[rgba(0,180,255,0.6)]"',
    'className="text-[rgba(0,212,255,0.35)]" style={{ fontSize: "0.7rem" }}'
)
content = content.replace(
    'className="text-sm text-[#00d4ff]"',
    'className="text-[#00d4ff]" style={{ fontSize: "0.75rem" }}'
)
content = content.replace(
    'className="text-[#00d4ff] text-sm"',
    'className="text-[#00d4ff]" style={{ fontSize: "0.75rem" }}'
)
content = content.replace(
    'className="text-[rgba(0,180,255,0.6)] text-sm mt-1"',
    'className="text-[rgba(0,212,255,0.35)] mt-1" style={{ fontSize: "0.7rem" }}'
)
content = content.replace(
    'className="space-y-2 text-sm text-[rgba(0,180,255,0.7)]"',
    'className="space-y-2 text-[rgba(0,212,255,0.4)]" style={{ fontSize: "0.72rem" }}'
)

with open('src/app/components/UnifiedSettingsPanel.tsx', 'w') as f:
    f.write(content)

print('Done: fixed remaining text-sm')
