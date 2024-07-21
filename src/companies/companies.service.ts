import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const company = this.companiesRepository.create(createCompanyDto);
    return await this.companiesRepository.save(company);
  }

  async findAll(): Promise<Company[]> {
    return await this.companiesRepository.find();
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companiesRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    await this.companiesRepository.update(id, updateCompanyDto);
    const updatedCompany = await this.companiesRepository.findOne({
      where: { id },
    });
    if (!updatedCompany) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return updatedCompany;
  }

  async remove(id: string): Promise<void> {
    const deleteResult = await this.companiesRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
  }
}
