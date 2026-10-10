ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS deps
RUN apk add --no-cache libc6-compat
# pnpm-workspace.yaml 必须随拷：pnpm 10+/11 的 overrides 配置源，缺失会触发
# ERR_PNPM_LOCKFILE_CONFIG_MISMATCH（frozen 校验 settings 与 lockfile 不符）
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# 固定主版本与 CI（9.x）一致，避免 pnpm@latest 漂移到 11.x 造成行为差异
RUN corepack enable pnpm && corepack prepare pnpm@9 --activate
RUN pnpm install --frozen-lockfile --prod=false

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable pnpm && corepack prepare pnpm@9 --activate
RUN pnpm install --frozen-lockfile
RUN pnpm build

ARG VERSION=0.0.1
ARG BUILD_DATE
ARG VCS_REF

ENV NODE_ENV=production
ENV VERSION=${VERSION}
ENV BUILD_DATE=${BUILD_DATE}
ENV VCS_REF=${VCS_REF}

FROM nginx:alpine AS runner
RUN apk add --no-cache curl

ARG VERSION
ARG BUILD_DATE
ARG VCS_REF

LABEL maintainer="YanYuCloudCube Team <admin@0379.email>"
LABEL org.opencontainers.image.title="YYC³ CloudPivot Intelli-Matrix"
LABEL org.opencontainers.image.description="Enterprise-level intelligent matrix management system"
LABEL org.opencontainers.image.version=${VERSION}
LABEL org.opencontainers.image.created=${BUILD_DATE}
LABEL org.opencontainers.image.revision=${VCS_REF}
LABEL org.opencontainers.image.vendor="YanYuCloudCube"

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html

RUN echo "Build Info:" > /usr/share/nginx/html/build-info.txt && \
    echo "Version: ${VERSION}" >> /usr/share/nginx/html/build-info.txt && \
    echo "Build Date: ${BUILD_DATE}" >> /usr/share/nginx/html/build-info.txt && \
    echo "VCS Ref: ${VCS_REF}" >> /usr/share/nginx/html/build-info.txt

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
