# 3장 실습 단계별 한 줄 정리

## 0. 환경 준비 ✅: 실습할 작업장 만들기
1. WSL2 Ubuntu 24.04 설치. 네트워크는 **NAT 모드**로 둠 (mirrored 모드에서는 Pod 통신이 끊겼음)
2. Python(uv), k3s, kubectl, helm, Docker 설치. k3s는 traefik을 끄고 설치
3. WSL 메모리를 10GB로 늘림 (GitLab까지 띄우려고)

*NAT 모드는 집 공유기처럼 Windows가 WSL(우분투)에게 따로 내부 주소(예: 172.x.x.x)를 주고 인터넷 연결은 Windows를 거쳐 나가게 하는 방식이라서, k3s의 Pod 네트워크는 잘 돌아가지만 Windows에서 localhost로 NodePort에 바로 들어갈 수 없어 WSL IP나 kubectl port-forward를 써야 한다는 뜻.*

## 3-1 앱 로컬 실행 ✅: 책 앱을 내 PC에서 먼저 돌려 보기
1. 3장 전용 Python 3.10 가상환경 만들기: `uv venv --python 3.10 .venv`
2. 책의 `requirements.txt` 설치
3. 테스트 실행 → **실패**. 버전을 고정하지 않은 httpx가 최신 0.28로 설치돼서 `TypeError ... 'app'` 발생
4. `httpx<0.28`로 낮춰 설치 → `1 passed`
5. `uvicorn`으로 서버를 켜고 `curl localhost:8083/` → 농담 응답



## 3-2 Pod → ReplicaSet → Deployment ✅: 앱을 쿠버네티스에 올리고 개수·버전 관리하기
1. Pod 1개 띄우기 (`k8s/pod.yaml`)
2. ReplicaSet 적용 → 이미 떠 있던 Pod를 label이 같아서 **입양**하고, 2개만 새로 만듦
3. Pod 하나를 지움 → 바로 새 Pod로 채워짐 (스스로 복구)
4. ReplicaSet 삭제 → 입양한 Pod까지 같이 지워짐
5. Deployment 적용 → Pod 3개
6. `kubectl set image`로 v2 교체 → "성공"이라고 나왔지만 **응답 없음** (v2는 80번 포트를 쓰는데 readinessProbe가 없음)
7. `rollout history`로 이력 확인, `rollout undo`로 v1 복귀

*kubectl은 쿠버네티스에게 띄우기·지우기·이미지 교체 같은 명령을 보내는 리모컨이고, *
*Pod는 앱 컨테이너가 실제로 돌아가는 가장 작은 단위(k8s/pod.yaml로 띄운 1개)이며, *
*ReplicaSet은 "이 이름표(label)가 붙은 Pod를 N개 유지하라"를 지키는 관리자라서 같은 이름표의 기존 Pod는 입양하고, Pod 하나가 지워지면 바로 새로 채우고, 자기가 지워질 때는 맡은 Pod도 함께 지운다.*

## 3-3 Service ✅: 바뀌는 Pod 앞에 고정 주소 달기
1. ClusterIP 적용 → Endpoints에 Pod 3개 주소(`IP:8083`)가 보임
2. 클러스터 안 테스트 Pod에서 이름(`joker-cluster-ip-service`)으로 접속 → 성공
3. 요청 30개 → Pod 3개가 11·12·7개를 받음 (순서대로가 아니라 무작위 분배)
4. NodePort(30420) → Windows에서 **WSL IP:30420**으로 접속 (`localhost`로는 안 됨)
5. LoadBalancer → k3s가 노드 IP를 외부 IP로 줌, `WSL IP:80`으로 접속

*LoadBalancer는 Service 종류 중 하나로, 클러스터 바깥에서 들어오는 요청을 받는 대표 주소(외부 IP)를 하나 만들어 뒤에 있는 여러 Pod에 골고루 나눠 주는 식당 입구 안내원 같은 것*

## 3-4 Namespace / ConfigMap / Secret ✅: 칸 나누기, 설정과 비밀값 넣기
1. `funny` 네임스페이스용 매니페스트 적용 → `namespaces "funny" not found` (네임스페이스는 자동으로 생기지 않음)
2. `kubectl create namespace funny` 후 다시 적용 → default와 funny에 같은 이름의 앱이 함께 존재
3. 다른 칸의 앱은 `서비스이름.funny`로 접속
4. ConfigMap과 책 Pod 적용 → 종료 코드 0인데 `CrashLoopBackOff` (할 일이 없어서 계속 종료되고 재시작됨)
5. 할 일(`env` 출력 후 대기)을 넣은 Pod → 로그에 환경변수가 보임
6. Secret 적용 → `base64 -d`로 원문이 바로 나옴 (인코딩일 뿐, 암호화가 아님)
7. 책 Secret Pod → 오류 2개(`configMapKeyRef` 오용, `-`/`_` 혼동)를 하나씩 고쳐 Running
8. `kubectl exec ... printenv` → 비밀번호가 평문으로 보임

*Namespace는 한 클러스터를 여러 칸으로 나누는 폴더 같은 것으로, 같은 이름의 Pod나 Service도 칸이 다르면 함께 둘 수 있고, -n 없이 명령하면 default 칸에서 찾는다(k3s 자체 부품은 kube-system 칸에 있다)*
*매니페스트 적용은 "Pod 3개, 이미지 v1, label app=…"처럼 원하는 상태를 적은 YAML 주문서(매니페스트)를 kubectl apply -f 파일.yaml로 쿠버네티스에 건네는 일이고, 그러면 쿠버네티스가 지금 상태를 그 주문서와 똑같이 맞춰 준다(없으면 만들고, 다르면 고친다).*
*ConfigMap은 DB 주소나 모드 값 같은 설정을 이미지 밖에 따로 적어 두는 메모장으로, Pod가 뜰 때 환경변수나 파일로 받아 쓰기 때문에 설정을 바꿔도 이미지를 다시 빌드할 필요가 없다(비밀번호처럼 숨겨야 하는 값은 ConfigMap이 아니라 Secret에 둔다).*
*Secret은 ConfigMap과 쓰는 방법(환경변수나 파일로 Pod에 넣기)은 같지만 비밀번호나 토큰 같은 민감한 값을 담는 봉투인데, 기본으로는 base64로 글자만 바꿔 적을 뿐 암호화되지 않기 때문에 "봉인된 금고"가 아니라 "불투명한 봉투" 정도로 보고, Git에 커밋하지 않는 등 조심해서 다뤄야 한다.*

## 3-5 Docker 이미지 🔵 (①~③ 일부 함께 함): 앱을 이미지로 포장해 창고(Docker Hub)에 올리기
1. ① 책 Dockerfile 그대로 빌드 → **실패**. `[3/8] apt-get` 404 (Debian 10 buster 지원 종료)
2. ② 첫 줄만 `python:3.10-slim-bookworm`으로 바꿔 빌드 → 성공 (333초, 909MB)
3. ③ `docker run -p 8083:8083` → WSL과 Windows `localhost` 둘 다 접속됨
4. ④ `.dockerignore`로 `.venv` 등을 빼고 이름을 `kichan87/hello-joker:v1`로 → 2초(캐시), 793MB
5. ⑤ `docker push`로 Docker Hub에 올림 (학습자 `docker login` 후)
6. ⑥ k3s가 Docker Hub에서 이미지를 받아 배포 → 2/2 Running

## 3-6 Helm 🔵: 매니페스트 여러 개를 "설정 꾸러미" 하나로 설치하기
1. `helm lint` → 차트 문법 검사 통과
2. `helm install joker` → Deployment 3/3과 Service가 한 번에 생김
3. `--set image.tag=v2`로 upgrade → helm은 "deployed"라고 하지만 새 Pod는 0/1. **readinessProbe가 막아 줘서** v1이 계속 응답 (3-2와 비교 포인트)
4. `helm rollback joker 1` → 되돌리기도 새 리비전(3)으로 기록됨
5. redis 차트 설치 → `ImagePullBackOff` (Bitnami 옛 이미지가 `bitnamilegacy`로 옮겨 감)
6. 저장소를 바꿔 upgrade → StatefulSet Pod가 그대로라 멈춘 Pod를 직접 삭제
7. `--reuse-values`로 upgrade → 원래 값으로 돌아가 실패 (마지막 **성공** 리비전의 값을 씀)
8. values 파일(`redis-values.yaml`)로 upgrade → master 1개 + replica 3개 Ready
9. master에 값 쓰기 → replica에서 읽힘, Pod를 다시 만들어도 값이 남음 (PVC 디스크)

## 3-7 GitLab CI 🔵: push하면 시험·포장·업로드를 대신 해 주는 일꾼 만들기
1. GitLab CE를 Docker 컨테이너로 띄움 (`localhost:8929`, 켜지는 데 약 3~4분, 메모리 3GiB)
2. 책과 같은 이름으로 프로젝트 `learn-mlops/gitlab-ci-example` 생성
3. GitLab Runner 컨테이너를 띄우고 등록 (작업마다 새 컨테이너를 띄우는 방식, dind용 privileged)
4. 책 코드와 수정본을 push (CI 파일은 이미지 이름과 저장소 주소 **두 군데만** 수정)
5. 파이프라인 #1 → test **실패** (httpx, 3-1과 같은 이유)
6. `httpx==0.27.2`로 고정 → #2에서 test 성공, build **실패** (`DOCKER_PASSWORD` 변수 없음)
7. Docker Hub 자격 증명을 가려진(masked) CI 변수로 등록하고 재시도 → 이미지 `:de7fe779` push 성공
8. update 단계 → `values.yaml`의 태그를 커밋 번호로 바꿔 `[skip ci]` 커밋을 push
9. #3은 skipped (`[skip ci]` 덕분에 파이프라인이 무한 반복되지 않음)

## 3-8 Argo CD 🔵: Git에 적힌 대로 클러스터를 맞춰 주는 관리인 두기
1. Helm으로 Argo CD 설치 (화면은 `WSL IP:30880`)
2. 읽기 전용 Deploy Token으로 GitLab 저장소 연결
3. Application `hello-joker` 적용 → Git의 Helm 차트를 `hello-joker` 네임스페이스에 배포
4. 처음엔 `ErrImagePull` (Docker Hub에 이미지가 아직 없었음) → 3-5에서 push한 뒤 저절로 정상 (Synced/Healthy)
5. CI가 태그를 바꾸면 약 25초 뒤 자동으로 롤링 업데이트
6. 손으로 `replicas=1`로 줄임 → 몇 초 만에 3으로 되돌림 (selfHeal)

## 3-9 Prometheus + Grafana 🔵: 앱 건강 기록을 모아 그래프로 보기
1. kube-prometheus-stack 설치 (Prometheus `:30090`, Grafana `:30300`)
2. node-exporter 오류 (WSL의 `/` 마운트 방식 때문) → 해당 옵션을 끄자 모든 대상이 up
3. ServiceMonitor 적용 ("이 앱의 `/metrics`를 수집하라"는 지시서)
4. Grafana 대시보드 적용 → `hello-joker (ch03 3-9)`가 자동 등록됨
5. 책 앱에는 `/metrics`가 없어 404 → `main.py`에 2줄 추가
6. push → 파이프라인 #4 성공 → Argo CD가 약 60초 뒤 새 이미지로 배포
7. 요청 400개 보냄 → Prometheus 대상 3개 up, Grafana 패널 5개에 데이터 표시

---

**3장 전체 흐름:** 코드 push → CI가 시험·포장·업로드하고 차트 태그 수정 → Argo CD가 배포 → Prometheus가 수집 → Grafana가 그래프로 표시
