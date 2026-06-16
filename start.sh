#!/bin/bash

# Navega para o diretório do script
cd "$(dirname "$0")"

# Verifica se o container do banco de dados existe e inicia ele
if [ "$(docker ps -aq -f name=zeroberto-db)" ]; then
    echo "Iniciando o banco de dados (zeroberto-db)..."
    docker start zeroberto-db
fi

echo "Iniciando a aplicação..."
npm run dev:full
