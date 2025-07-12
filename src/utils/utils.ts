import { encode } from "gpt-tokenizer";

/** 字符串截取省略号替代 */
export function truncateName(name: string, maxLength: number) {
  if (!name || name === "") {
    return "";
  }
  if (name.length > maxLength) {
    return name.slice(0, maxLength - 3).trim() + "...";
  }
  return name;
}

/** 对象转表单对象 */
export function toFormData(data: any) {
  let formData = new FormData();
  for (let key in data) {
    formData.append(key, data[key]);
  }
  return formData;
}

/**字节转换，返回单位和大小组成的对象 */
export function bytesToSize(bytes: number) {
  if (bytes === 0) return { size: 0, unit: "B" };
  let k = 1024;
  let sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = Math.floor(Math.log(bytes) / Math.log(k));
  return {
    size: parseFloat((bytes / Math.pow(k, i)).toFixed(2)),
    unit: sizes[i],
  };
}

/**
 *
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @returns 差值
 */
export function getDateDiff(startTime: string, endTime: string) {
  if (!startTime || !endTime) {
    return "";
  }
  //将日期字符串转换为时间戳
  let sTime = new Date(startTime).getTime(); //开始时间
  let eTime = new Date(endTime).getTime(); //结束时间
  let divNumSecond = 1000;
  /** 换算成秒 */
  const diff = (eTime - sTime) / divNumSecond;
  if (diff > 60 && diff / 60 < 60) {
    // 超过分钟但没有超过小时，按分钟算
    let miniute = Math.floor(diff / 60);
    let second = diff % 60;
    return second === 0 ? `${miniute}分钟` : `${miniute}分钟,${second}秒`;
  } else if (diff > 3600 && diff / 3600 < 24) {
    // 超过小时但没有超过天，按小时，分钟，秒算
    let hour = Math.floor(diff / 3600);
    let minute = Math.floor((diff % 3600) / 60);
    return minute === 0 ? +`${hour}小时` : `${hour}小时,${minute}分钟`;
  } else {
    return diff + "秒";
  }
}

/** 获取token数量 */
export function lenTokens(input: string) {
  const tokens = encode(input);
  return tokens.length;
}

/**
 * 对ai作答的内容进行处理
 * @param responseContent ai响应的小时
 * @param think 是否提取think部分，默认true，false反之
 */
export function processContent(responseContent: string, think: boolean = true) {
  let returnContent = responseContent;
  if (!returnContent) {
    return "";
  }
  if (think) {
    /** 只保留<think></think>标记的内容 */
    let match = responseContent.match(/^<think[^>]*>([\s\S]*?)<\/think>/i);
    if (match) {
      returnContent = match[1];
    }
    /** 如果一模一样，说明没有思考这一环节 */
    if (returnContent === responseContent) {
      returnContent = "";
    }
  } else {
    /** 剔除<think></think>标记的内容*/
    returnContent = responseContent.replace(/<think>[\s\S]*?<\/think>/g, "");
  }

  return returnContent.replaceAll("<think>", "");
}

export default function buildThinkTitle(
  thinkContent: string,
  bAnwserOver: boolean
) {
  if (thinkContent === "") {
    return bAnwserOver ? "已回答完毕" : "回复进行中";
  } else {
    return bAnwserOver ? "已深度思考" : "深度思考中";
  }
}

export function processSourceContent(responseContent: string) {
  let returnContent = responseContent;
  /** 剔除<think></think>标记的内容*/
  returnContent = responseContent.replace(
    /<document_metadata>[\s\S]*?<\/document_metadata>/g,
    ""
  );
  return returnContent.replaceAll("<document_metadata>", "");
}

/** unix时间戳转dateStr */
export function convertTimestampToDate(timestamp?: number) {
  if (!timestamp) {
    timestamp = Date.now();
  } else {
    if (timestamp.toString().length === 13) {
      // 如果是毫秒级时间戳，直接使用
    } else if (timestamp.toString().length === 10) {
      // 如果是秒级时间戳，乘以1000转换为毫秒
      timestamp *= 1000;
    }
  }
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 获取时间唯一key
 * @param delay 延迟多少毫秒 （主要为了那种调用多次，但又不想出现timeKey一致的情况）
 * @returns number
 */
export function getTimeKey(delay: number = 0) {
  return Date.now() + delay;
}