# Docker開発環境構築手順

## （初回クローン時のみ）node_modulesインストール
```
$ docker-compose run -w /usr/app --rm node npm install
```

## Dockerセットアップ
```
$ docker-compose up -d --build
```

## ローカル表示
```
URL：http://localhost:3000/
```