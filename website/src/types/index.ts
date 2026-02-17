import type { Property, PropertyImage, Area, BlogPost, BlogCategory, Testimonial, Contact } from "@prisma/client";

export type PropertyWithRelations = Property & {
  images: PropertyImage[];
  area: Area | null;
};

export type BlogPostWithRelations = BlogPost & {
  category: BlogCategory | null;
};

export type PropertyFilterParams = {
  type?: string;
  status?: string;
  areaId?: string;
  minPrice?: string;
  maxPrice?: string;
  minRooms?: string;
  maxRooms?: string;
  search?: string;
  page?: string;
};

export type { Property, PropertyImage, Area, BlogPost, BlogCategory, Testimonial, Contact };
