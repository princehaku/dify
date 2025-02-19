import json
from typing import List, Dict

def main(today_data_str: str, yesterday_data_str: str) -> str:
    # 解析输入的 JSON 字符串
    today_data = json.loads(today_data_str)
    yesterday_data = json.loads(yesterday_data_str)

    # 创建一个字典来存储昨天的数据，以便快速查找
    yesterday_dict = {item['taskId']: item for item in yesterday_data}

    # 定义字段映射关系
    field_mapping = {
        "createTime": "创建日期",
        "taskId": "任务ID",
        "taskName": "外呼任务名称",
        "callSum": "外呼量",
        "callCount": "接通量",
        "intentionCount": "AB意向数",
        "callBillingMinute": "计费分钟数",
        "tagIdA": "A意向数",
        "tagIdB": "B意向数"
    }

    transformed_data = []

    for today_item in today_data:
        yesterday_item = yesterday_dict.get(today_item['taskId'], {})

        # 计算增量
        callSum_diff = today_item.get('callSum', 0) - yesterday_item.get('callSum', 0)
        callCount_diff = today_item.get('callCount', 0) - yesterday_item.get('callCount', 0)
        intentionCount_diff = today_item.get('intentionCount', 0) - yesterday_item.get('intentionCount', 0)
        callBillingMinute_diff = today_item.get('callBillingMinute', 0) - yesterday_item.get('callBillingMinute', 0)
        tagIdA_diff = today_item.get('tagIdA', 0) - yesterday_item.get('tagIdA', 0)
        tagIdB_diff = today_item.get('tagIdB', 0) - yesterday_item.get('tagIdB', 0)

        # 创建新的字典并应用字段映射
        new_item = {
            "创建日期": today_item.get('createTime'),
            "任务ID": today_item.get('taskId'),
            "外呼任务名称": today_item.get('taskName'),
            "外呼量": str(callSum_diff),
            "接通量": str(callCount_diff),
            "A意向数": str(tagIdA_diff),
            "B意向数": str(tagIdB_diff),
            "AB意向数": str(intentionCount_diff),
            "计费分钟数": str(callBillingMinute_diff)
        }

        transformed_data.append(new_item)

    # 输出结果
    return {"result": json.dumps(transformed_data, ensure_ascii=False, indent=4)}
