const fs = require('fs');
const path = require('path');
// Caminho para o diretório do projeto
const projectDir = path.join(__dirname, '..');

// Caminho para o diretório node_modules
const nodeModulesDir = path.join(projectDir, 'node_modules');

// Caminho para o arquivo LastUpdated.astro dentro do node_modules
const filePath = path.join(nodeModulesDir, 'path-to-package', 'LastUpdated.astro');

// Leitura do arquivo
fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
                console.error('Erro ao ler o arquivo:', err);
                return;
        }

        // Modificação do conteúdo
        const modifiedData = data.replace(
                /{lastUpdated\.toLocaleDateString\(lang, \{ dateStyle: 'medium', timeZone: 'UTC' \}\)}/,
                "{lastUpdated.toLocaleDateString('pt-BR', { dateStyle: 'medium', timeZone: 'America/Sao_Paulo' })}"
        );

        // Escrita do arquivo modificado
        fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
                if (err) {
                        console.error('Erro ao escrever o arquivo:', err);
                } else {
                        console.log('Arquivo LastUpdated.astro modificado com sucesso.');
                }
        });
});