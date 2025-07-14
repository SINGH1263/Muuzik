import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";
const YT_REGEX = new RegExp("^https?:\/\/(www\.)?youtube\.com\/watch\?(.*&)?v=([a-zA-Z0-9_-]{11})(&.*)?$")
import youtubesearchapi from "youtube-search-api";

 const CreateStreamerSchema = z.object({
    createrId: z.string(),
    url: z.string()
 })


export async function POST(req: NextRequest){
    try{
    const data = CreateStreamerSchema.parse(await req.json());
    const isyt = YT_REGEX.test(data.url);
    if(!isyt){
        return  NextResponse.json({
            message: "Wrong URL format"
        },{
            status: 411
        })
    }

    const extractedId = data.url.split("?v=")[1];

    const res: any = await youtubesearchapi.GetVideoDetails(extractedId);
    
    console.log(res.thumbnail.thumbhnails);
    const thumbhnails = res.thumbnail.thumbhnails;
thumbhnails.sort((a: {width:number}, b: {width:number})=> a.width<b.width ? -1 : 1);

   const stream = await  prisma.stream.create({
        data: {
        userId: data.createrId,
        url: data.url,
        extractedId,
        type: "Youtube",
        title: res.title ?? "cant find video",  
        smallImg: (thumbhnails.length>1 ? thumbhnails[thumbhnails.length -2].url: thumbhnails[thumbhnails.length-1].url)??"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkvmpWVs9URs3C8M8uEaIOJaMLU8TzH-ZrhA&s",
        bigImg: thumbhnails[thumbhnails.length-1].url ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkvmpWVs9URs3C8M8uEaIOJaMLU8TzH-ZrhA&s"
        }
    });

    return NextResponse.json({
        message: "Added stream",
        id: stream.id
    })
}
 catch(e){
    console.log(e);
    return NextResponse.json({
        messgae: "Error while adding a stream"
    }, {
        status:411
    })
}

}