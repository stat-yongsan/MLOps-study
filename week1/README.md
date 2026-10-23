# MLOps-study
Machine Learning Platform Engineering Study

OS는 window환경에서 진행했다.
시작 전 나는 초보이기 때문에 기본 개념정리부터 하겠다
- Linux → Docker → Docker Compose → Kubernetes → CI/CD → MLOps 순으로 학습

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

---

**인공지능 분야는 AI ⊃ ML ⊃ DL ⊇ 생성형 AI ⊇ LLM(Large Language Model)의 포함 관계다.**


# CH1. MLOps와 ML 엔지니어링 시작

머신러닝 프로젝트는 저마다 다르지만, 머신러닝 모델을 개발하고 배포하는 단계는 대체로 비슷합니다. 머신러닝 프로젝트는 **본질적으로 반복**적인 성격을 띱니다. 
첫 번째 배포로 프로젝트가 마무리된 사례를 아직 본 적이 없습니다.
<img width="860" alt="ml_lifecycle_flow" src="https://github.com/user-attachments/assets/9d6dc8e0-3511-4f09-bcfa-3cf38cf0d89d" />

## 1.1. 머신러닝 수명주기
머신러닝 프로젝트는 **수많은 시행착오를 동반하는 지속적인 실험의 연속**이다.
- 화살표가 단방향을 가리키고 있지만, 실제로는 **거의 모든 단계에서 반복이 빈번히 발생**합니다. 예를 들어, 모델 훈련과 모델 평가 evaluation 단계 사이에 있다고 가정해보겠습니다. 평가 지표가 기준에 미치지 못한다면, 다른 모델 아키텍처를 검토하거나 더 앞 단계로 돌아가 충분한 고품질 데이터가 확보되었는지 확인할 수도 있습니다. 각 단계는 상당히 복잡할 수 있으며, 단계 간 흐름은 루프를 포함한 비선형 구조인 경우가 많다는 점에 유의하십시오.
- 바로 이런 이유로, 이 **모든 단계를 하나의 오케스트레이션 파이프라인으로 통합**합니다. 오케스트레이션 파이프라인을 구성하면 처음부터 자동화가 내재되므로, 추적하기 어려운 실수를 저지를 가능성을 벗어날 수 있습니다.



## 1.2 MLOps에 필요한 역량
## 1.3 머신러닝 플랫폼 구축
## 1.4 머신러닝 시스템 구축

# CH2. MLOps란 무엇인가

## 2.1.0 문제 정의 및 설계*
## 2.1.1 데이터 수집*
## 2.1.2 탐색적 데이터 분석 EDA
## 2.1.3 모델링과 훈련*
## 2.1.4 모델 평가*
## 2.1.5 배포*
## 2.1.6 모니터링
## 2.1.7 유지보수, 업데이트, 검토
