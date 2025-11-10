export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  price: number;
  is_public: boolean;
  thumbnail_url_desktop?: string;
  thumbnail_url_mobile?: string;
  course_code: number;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  order_index: number;
  is_published: boolean;
  estimated_duration_minutes?: number;
  created_at: string;
  updated_at: string;
}

export interface ModuleContent {
  id: string;
  module_id: string;
  title: string;
  description?: string;
  content_type: 'video' | 'text' | 'pdf' | 'audio' | 'quiz';
  content_url?: string;
  content_text?: string;
  thumbnail_url?: string;
  order_index: number;
  is_published: boolean;
  duration_minutes?: number;
  created_at: string;
  updated_at: string;
}

export interface UserCourse {
  id: string;
  user_id: string;
  course_id: string;
  progress_percentage: number;
  completed_at?: string;
  last_accessed_at: string;
  enrolled_at: string;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  course_id: string;
  completed_modules: string[];
  watched_contents: string[];
  total_watched_time_minutes: number;
  last_watched_content_id?: string;
  last_watched_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CourseWithModules extends Course {
  modules: (CourseModule & {
    contents: ModuleContent[];
  })[];
}

export interface UserCourseProgress {
  course: CourseWithModules;
  userCourse: UserCourse;
  userProgress: UserProgress;
}
