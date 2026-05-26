export interface RoadmapItem {
  name: string
  badge: string
  items: string[]
  resources?: string
}

export interface RoadmapPhase {
  phase: number
  title: string
  weeks: string
  icon: string
  sections: RoadmapItem[]
}

export const roadmap: RoadmapPhase[] = [
  {
    phase: 1,
    title: 'Foundations',
    weeks: '1 – 4',
    icon: '🧱',
    sections: [
      {
        name: 'TypeScript',
        badge: 'bg-accent',
        items: [
          'Types, interfaces, generics, enums',
          'Utility types: Partial, Pick, Omit, Record, Readonly',
          'Decorators (critical for TypeORM)',
          'tsconfig.json — strict, target, paths, decoratorMetadata',
          'Type narrowing, discriminated unions',
        ],
        resources: '<a href="https://www.typescriptlang.org/docs/handbook/intro.html" target="_blank">TypeScript Handbook</a> · <a href="https://www.totaltypescript.com/tutorials" target="_blank">Total TypeScript</a>'
      },
      {
        name: 'Node.js',
        badge: 'bg-accent',
        items: [
          'Event loop, async/await, Promises',
          'Streams, Buffer, fs, path, http modules',
          'Error handling patterns (custom errors, async error boundaries)',
          'Environment config (dotenv, process.env)',
          'Module system (ESM vs CJS)',
        ]
      }
    ]
  },
  {
    phase: 2,
    title: 'Backend Development',
    weeks: '5 – 10',
    icon: '⚙️',
    sections: [
      {
        name: 'Express / Fastify + TypeScript',
        badge: 'bg-cyan',
        items: [
          'REST API design (resource naming, status codes, versioning)',
          'Middleware pattern (auth, logging, error handling, validation)',
          'Request validation: zod or class-validator',
          'JWT authentication + refresh tokens',
          'Rate limiting, CORS, Helmet',
        ]
      },
      {
        name: 'TypeORM + PostgreSQL',
        badge: 'bg-cyan',
        items: [
          'Entities, decorators (@Entity, @Column, @PrimaryGeneratedColumn)',
          'Relations: @OneToMany, @ManyToOne, @ManyToMany, @OneToOne',
          'Migrations (typeorm migration:generate, migration:run)',
          'Repositories vs EntityManager',
          'QueryBuilder for complex queries',
          'Transactions',
          'Lazy vs eager loading, relations option',
        ]
      },
      {
        name: 'MongoDB',
        badge: 'bg-cyan',
        items: [
          'Document modeling, embedding vs referencing',
          'Indexes, aggregation pipeline',
          'Schema validation',
          'When to use Mongo vs Postgres (key interview topic)',
        ]
      },
      {
        name: 'PostgreSQL Deep Dive',
        badge: 'bg-cyan',
        items: [
          'Joins, CTEs, window functions',
          'Indexes (B-tree, GIN, partial)',
          'EXPLAIN ANALYZE',
          'Connection pooling (pg-pool, PgBouncer)',
        ]
      }
    ]
  },
  {
    phase: 3,
    title: 'Frontend — Vue.js',
    weeks: '11 – 16',
    icon: '🖥️',
    sections: [
      {
        name: 'Vue.js 3 + TypeScript',
        badge: 'bg-green',
        items: [
          'Composition API (setup, ref, reactive, computed, watch)',
          'defineProps, defineEmits, defineExpose',
          'Vue Router 4 — guards, lazy loading, nested routes',
          'Pinia (state management)',
          'Composables (custom hooks equivalent)',
          '<script setup> syntax',
          'Component lifecycle hooks',
          'Teleport, Suspense, async components',
        ]
      },
      {
        name: 'API Integration',
        badge: 'bg-green',
        items: [
          'Axios interceptors for auth headers + token refresh',
          'Error boundary patterns',
          'Loading/error state management',
          'Environment-based API URLs',
        ]
      },
      {
        name: 'Build Tooling',
        badge: 'bg-green',
        items: [
          'Vite config, aliases, env variables',
          'Code splitting, lazy routes',
          'TypeScript path aliases matching backend',
        ]
      }
    ]
  },
  {
    phase: 4,
    title: 'AWS Core Services',
    weeks: '17 – 22',
    icon: '☁️',
    sections: [
      {
        name: 'IAM (Learn First)',
        badge: 'bg-yellow',
        items: [
          'Users, Groups, Roles, Policies',
          'Least-privilege principle',
          'Inline vs managed policies',
          'Trust relationships for service roles',
          'Instance profiles (EC2 → S3, EC2 → RDS)',
          'OIDC federation (GitHub Actions → AWS)',
        ]
      },
      {
        name: 'EC2',
        badge: 'bg-yellow',
        items: [
          'Launch instance, security groups, key pairs',
          'AMIs, user data scripts',
          'Auto Scaling Groups + Launch Templates',
          'Load Balancers (ALB vs NLB)',
          'Target groups, health checks',
          'SSH access, Systems Manager Session Manager',
          'EBS volumes, snapshots',
        ]
      },
      {
        name: 'Lambda',
        badge: 'bg-yellow',
        items: [
          'Function anatomy, handler, context, event',
          'Layers (shared deps, TypeScript compilation)',
          'Environment variables + SSM Parameter Store',
          'Cold starts — mitigation (provisioned concurrency)',
          'Timeouts, memory tuning',
          'Lambda + API Gateway (REST & HTTP APIs)',
          'Lambda + SQS, SNS, S3 triggers',
          'VPC Lambda (accessing RDS privately)',
          'Deployment: SAM, Serverless Framework, or CDK',
        ]
      },
      {
        name: 'Networking',
        badge: 'bg-yellow',
        items: [
          'VPC, subnets (public/private), route tables',
          'Internet Gateway, NAT Gateway',
          'Security Groups vs NACLs',
          'VPC Endpoints (S3, DynamoDB, SSM)',
        ]
      },
      {
        name: 'Other AWS Services',
        badge: 'bg-yellow',
        items: [
          'RDS — PostgreSQL, parameter groups, Multi-AZ, read replicas',
          'DocumentDB (MongoDB-compatible) or Atlas on AWS',
          'S3 — buckets, presigned URLs, bucket policies, lifecycle rules',
          'API Gateway — REST vs HTTP API, CORS, throttling, stages',
          'CloudFront — CDN for Vue SPA, cache behaviors, OAC with S3',
          'SQS/SNS — queue vs pub-sub, DLQs, FIFO queues',
          'Secrets Manager — rotating DB credentials',
          'SSM Parameter Store — config values, secure strings',
          'CloudWatch — logs, metrics, alarms, log insights',
          'ECR + ECS/Fargate — containerized Node.js deployment',
          'Route 53 — DNS, health checks, weighted routing',
          'ACM — SSL certificates for ALB/CloudFront',
        ]
      }
    ]
  },
  {
    phase: 5,
    title: 'DevOps & Deployment',
    weeks: '23 – 28',
    icon: '🚀',
    sections: [
      {
        name: 'Docker',
        badge: 'bg-orange',
        items: [
          'Dockerfile for Node.js (multi-stage builds)',
          'docker-compose for local dev (Node + Postgres + Mongo)',
          '.dockerignore',
          'Layer caching optimization',
        ]
      },
      {
        name: 'CI/CD',
        badge: 'bg-orange',
        items: [
          'GitHub Actions — build, test, deploy pipeline',
          'OIDC-based AWS auth (no long-lived keys)',
          'Deploy Lambda via SAM or CDK',
          'Deploy to ECS/Fargate or EC2 via CodeDeploy',
          'Vue.js → S3 + CloudFront invalidation',
        ]
      },
      {
        name: 'Infrastructure as Code',
        badge: 'bg-orange',
        items: [
          'AWS CDK (TypeScript) — preferred for TS developers',
          'Core constructs: Stack, Construct, App',
          'Deploy RDS, Lambda, API Gateway, S3 with CDK',
        ]
      },
      {
        name: 'Monitoring',
        badge: 'bg-orange',
        items: [
          'Structured logging (pino, winston) → CloudWatch',
          'X-Ray tracing on Lambda + API Gateway',
          'CloudWatch dashboards + alarms → SNS alerts',
        ]
      }
    ]
  },
  {
    phase: 6,
    title: 'Security & Production',
    weeks: '29 – 32',
    icon: '🔒',
    sections: [
      {
        name: 'Application Security',
        badge: 'bg-red',
        items: [
          'OWASP Top 10 (SQL injection, XSS, CSRF, IDOR)',
          'Input sanitization at API boundary',
          'Secrets never in code (SSM/Secrets Manager)',
          'HTTPS everywhere, HSTS',
          'DB connections via IAM auth (RDS IAM authentication)',
          'S3 bucket: block all public access, use presigned URLs',
          'WAF on CloudFront/ALB',
          'Rotate credentials, audit IAM with Access Analyzer',
        ]
      }
    ]
  },
  {
    phase: 7,
    title: 'System Design & Practice',
    weeks: 'Ongoing',
    icon: '🎯',
    sections: [
      {
        name: 'Design Patterns',
        badge: 'bg-pink',
        items: [
          'Auth flows: OAuth2, PKCE, refresh token rotation',
          'Caching: Redis (ElastiCache), CDN edge caching, query caching',
          'Background jobs: SQS + Lambda workers, cron via EventBridge',
          'File uploads: Presigned S3 URLs (never proxy through Node)',
          'Pagination: cursor-based vs offset (TypeORM supports both)',
          'Multi-tenancy: schema-per-tenant vs row-level with TypeORM',
          'API versioning strategies',
          'DB migrations in production (zero-downtime patterns)',
        ]
      },
      {
        name: 'Practice Projects',
        badge: 'bg-pink',
        items: [
          'Auth service — Node + TS + TypeORM + Postgres + JWT',
          'File manager — S3 presigned URLs + Mongo metadata + Vue 3 UI',
          'Task queue system — SQS + Lambda worker + Postgres result store',
          'Full deployment — all apps on AWS: RDS + Lambda + API GW + CloudFront + CDK',
        ]
      },
      {
        name: 'Certifications (optional)',
        badge: 'bg-pink',
        items: [
          'AWS SAA-C03 (Solutions Architect Associate) — High priority',
          'AWS DVA-C02 (Developer Associate) — High priority',
          'AWS SOA-C02 (SysOps) — Medium priority',
        ]
      }
    ]
  }
]