/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course, CourseDocument } from './schemas/course.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<CourseDocument>) { }

  async create(createCourseDto: CreateCourseDto) {
    const createdDoc = new this.courseModel({
      name: createCourseDto.name,
      description: createCourseDto.description,
      level: createCourseDto.level,
      price: createCourseDto.price,
    });
    const saved = await createdDoc.save();
    // log the created id so the server logs show whether a write occurred
    // (helpful when debugging why data isn't persisted)
  console.log('Created course id:', saved._id?.toString());
    return saved;
  }

  async findAll() {
    return this.courseModel.find().exec();
  }

  async findOne(id: string) {
    return this.courseModel.findById(id).exec();
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
  return this.courseModel.findByIdAndUpdate(id, updateCourseDto as Partial<Course>, { new: true }).exec();
  }

  async remove(id: string) {
    return this.courseModel.findByIdAndDelete(id).exec();
  }
}
