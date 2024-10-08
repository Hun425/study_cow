# 가동중인 backend 도커 중단 및 삭제
docker ps -a -q --filter "name=studycow-backend" | grep -q . && docker stop studycow-backend && docker rm studycow-backend | true

# 기존 이미지 삭제
docker rmi bonsik/studycow-backend:1.0

# 도커허브 이미지 pull
docker pull bonsik/studycow-backend:1.0

# 도커 run
docker run -d -p 8888:8888 --name studycow-backend bonsik/studycow-backend:1.0

# 사용하지 않는 불필요한 이미지 삭제 -> 현재 컨테이너가 물고 있는 이미지는 삭제되지 않습니다.
docker rmi -f $(docker images -f "dangling=true" -q) || true
