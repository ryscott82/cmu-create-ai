import re

with open('script.js', 'r') as f:
    content = f.read()

content = re.sub(r'const lesson1Rounds = \[.*?\];\n', '', content, flags=re.DOTALL)
content = re.sub(r'const animals = \[.*?\];\n', '', content, flags=re.DOTALL)
content = re.sub(r'const stageVocab = \[.*?\];\n', '', content, flags=re.DOTALL)
content = re.sub(r'const l6Objects = \[.*?\];\n', '', content, flags=re.DOTALL)
content = re.sub(r'const learnMoreData = \{.*?\};\n', '', content, flags=re.DOTALL)

with open('script.js', 'w') as f:
    f.write(content.strip() + '\n')
