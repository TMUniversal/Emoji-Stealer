import imagemin, { BufferOptions } from 'imagemin'
import imageminJpegtran from 'imagemin-jpegtran'
import imageminPngquant from 'imagemin-pngquant'
import imageminGifsicle from 'imagemin-gifsicle'

const compressorOptions: BufferOptions = {
  plugins: [imageminJpegtran(), imageminPngquant({ quality: [0.6, 0.8] }), imageminGifsicle()]
}

export default async function compress (data: Buffer): Promise<Buffer> {
  return await imagemin.buffer(data, compressorOptions)
}
