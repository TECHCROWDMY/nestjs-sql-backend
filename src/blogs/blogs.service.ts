// src/blogs/blogs.service.ts
import {
  Injectable,
  ConflictException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  async create(createBlogDto: CreateBlogDto): Promise<Blog> {
    const existingBlog = await this.blogRepository.findOne({
      where: { slug: createBlogDto.slug },
    });
    if (existingBlog) {
      throw new ConflictException('Slug must be unique');
    }

    const blog = this.blogRepository.create(createBlogDto);
    return this.blogRepository.save(blog);
  }

  findAll(): Promise<Blog[]> {
    return this.blogRepository.find();
  }

  findOne(id: string): Promise<Blog> {
    return this.blogRepository.findOne({ where: { id } });
  }

  async findOneBySlug(slug: string): Promise<Blog> {
    const blog = await this.blogRepository.findOne({ where: { slug } });
    if (!blog) {
      throw new NotFoundException(`Blog with slug ${slug} not found`);
    }
    return blog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog> {
    const existingBlog = await this.blogRepository.findOne({
      where: { slug: updateBlogDto.slug },
    });
    if (existingBlog && existingBlog.id !== id) {
      throw new ConflictException('Slug must be unique');
    }

    await this.blogRepository.update(id, updateBlogDto);
    return this.blogRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    const result = await this.blogRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    }
  }
}
