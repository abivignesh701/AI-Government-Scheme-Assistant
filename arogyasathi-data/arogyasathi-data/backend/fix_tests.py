import os, re
d='d:/Hack odyseey/arogyasathi-data/arogyasathi-data/backend/tests'
for f in os.listdir(d):
    if f.endswith('.ts'):
        path = os.path.join(d, f)
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        content = re.sub(r'import\s+\{\s*MongoMemoryServer\s*\}\s*from\s*\'mongodb-memory-server\';\n?', '', content)
        content = re.sub(r'let\s+mongoServer:\s*MongoMemoryServer;\n?', '', content)
        
        content = content.replace(
            'mongoServer = await MongoMemoryServer.create();\n  const uri = mongoServer.getUri();',
            'const uri = \'mongodb://127.0.0.1:27017/arogyasathi_test_\' + Math.random().toString(36).substring(7);\n'
        )
        content = content.replace(
            'await mongoServer.stop();',
            'if (mongoose.connection.db) { await mongoose.connection.db.dropDatabase(); }'
        )
        
        with open(path, 'w', encoding='utf-8') as file:
            file.write(content)
