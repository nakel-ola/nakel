type sanityDefaultProps = {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
};

interface AboutResponse extends sanityDefaultProps {
  bio: string;
  image: string;
  name: string;
  tel: string;
  address: string;
  email: string;
  resume: any;
}

interface SkillResponse {
  name: string;
  image: string;
  color: string;
  bgColor: string;
  percentage: number;
}

interface ServiceResponse extends sanityDefaultProps {
  title: string;
  image: string;
  description: string;
}

interface ProjectResponse extends sanityDefaultProps {
  pos: number;
  name: string;
  category: string[];
  description: string;
  tech: SkillResponse[];
  images: string[];
  link: string;
  github: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      EXPIRES_IN: string;
      REFRESH_EXPIRES_IN: string;
      STMP_PASSWORD: string;
      STMP_EMAIL: string;
      STORAGE_BUCKET_NAME: string;
      STORAGE_PROJECT_ID: string;
      MONGODB_URI: string;
    }
  }
}
