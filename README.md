# MLOps-study
Machine Learning Platform Engineering Study
초보이기 때문에 기본 개념정리부터 하겠다.
*Linux → Docker → Docker Compose → Kubernetes → CI/CD → MLOps 순으로 학습*

---

1. Linux: 서버를 운영하는 기본 환경
2. Docker: 프로그램 실행 환경과 함께 포장 *도커: 컨테이너를 만들고 실행하는 플랫폼(회사 이름이기도 함)*
3. Docker Compose: 여러 컨테이너를 한 번에(묶어서) 실행 *앱을 격리해서 패키징, 실행하는 기술/단위*


<img width="940" alt="image" src="https://github.com/user-attachments/assets/3e463738-7e3c-4ad2-a031-1edd154d9202">
  
```bash

docker compose up -d

```
*위 그림과 같은 구성의 실행을 하나의 명령어로 관리할 수 있다.*

5. Kubernetes: 여러 서버의 컨테이너를 자동 관리 *여러 서버의 컨테이너 총괄 관리자*
6. CI/CD: 코드 변경부터 배포까지 자동화

*CI: 코드가 변경되면 자동으로 검사·테스트·빌드*
*CD: 검증된 코드를 배포 가능한 상태로 준비하거나 실제 배포*

<img width="762" alt="image" src="https://github.com/user-attachments/assets/7235a156-2ace-4e36-b95f-74a6d4003e92" />

8. MLOps: AI 모델의 학습·배포·성능 관리를 자동화

**위 6개 기술을 비교하면**

<img width="798" height="328" alt="image" src="https://github.com/user-attachments/assets/cf65f348-c075-42ac-b6a2-f691353193b4" />

---

Linux: WSL2 설치, Linux 명령어 및 SSH 실습
Docker: Python FastAPI 서버를 Docker로 실행
Docker Compose: FastAPI와 PostgreSQL을 함께 실행
Kubernetes: Minikube 또는 kind로 로컬 배포
CI/CD: GitHub Actions 자동 테스트·배포
MLOps: MLflow 모델 학습·실험 기록·서빙
'''
