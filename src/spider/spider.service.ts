import { Injectable } from '@nestjs/common';
import { CreateSpiderDto } from './dto/create-spider.dto';
import { UpdateSpiderDto } from './dto/update-spider.dto';
import axios from 'axios';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SpiderService {
  constructor(private readonly httpService: HttpService) {}

  create(createSpiderDto: CreateSpiderDto) {
    return 'This action adds a new spider';
  }

  async findAll() {
    const urls: string[] = [];
    const index = 0;
    const getSize = 3;
    const webSite = 'https://wallhaven.cc/toplist';
    const getCosPlay = async () => {
      // 获取getSize页的图片
      for (let i = 0; i < getSize; i++) {
        console.log('获取第' + (i + 1) + '页');
        await this.httpService.axiosRef
          .get(`${webSite}${index === 0 ? '' : '?page=' + index}`)
          .then((res) => {
            const $ = cheerio.load(res.data);
            $('.thumb-listing-page ul li').each(function () {
              let url = $(this).find('figure img').attr('data-src');
              url = url.replace('th.wallhaven.cc', 'w.wallhaven.cc');
              url = url.replace('small', 'full');
              url = url.replace(
                url.split('/')[url.split('/').length - 1],
                'wallhaven-' + url.split('/')[url.split('/').length - 1],
              );
              urls.push(url);
            });
          });
        // 暂停1秒
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(null);
          }, 1000);
        });
      }
    };
    await getCosPlay();
    console.log('urls', urls);
    // this.writeFile(urls);

    return {
      code: 200,
      webSite,
      data: urls,
    };
  }
  // async findAll() {
  //   const baseUrl = 'https://www.jpmn5.com';
  //   const next = '下一页';
  //   let index = 0;
  //   const urls: string[] = [];
  //   const getCosPlay = async () => {
  //     console.log(index);
  //     await this.httpService.axiosRef
  //       .get(
  //         `https://www.jpmn5.com/Cosplay/Cosplay10772${
  //           index ? '_' + index : ''
  //         }.html`,
  //       )
  //       .then(async (res) => {
  //         //console.log(res.data)
  //         const $ = cheerio.load(res.data);
  //         const page = $('.article-content .pagination a')
  //           .map(function () {
  //             return $(this).text();
  //           })
  //           .toArray();
  //         if (page.includes(next)) {
  //           $('.article-content p img').each(function () {
  //             console.log($(this).attr('src'));
  //             urls.push(baseUrl + $(this).attr('src'));
  //           });
  //           index++;
  //           await getCosPlay();
  //         }
  //       });
  //   };
  //   await getCosPlay();
  //   console.log(urls);
  //   this.writeFile(urls);
  // }
  writeFile(urls: string[]) {
    urls.forEach(async (url) => {
      const buffer = await this.httpService
        .axiosRef(url, { responseType: 'arraybuffer' })
        .then((res) => res.data);
      const ws = fs.createWriteStream(
        path.join(__dirname, '../img/cos' + new Date().getTime() + '.jpg'),
      );
      console.log('buffer', buffer);
      ws.write(buffer);
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} spider`;
  }

  update(id: number, updateSpiderDto: UpdateSpiderDto) {
    return `This action updates a #${id} spider`;
  }

  remove(id: number) {
    return `This action removes a #${id} spider`;
  }
}
