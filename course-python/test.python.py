import json

def main(yesterday_data_str: str, today_data_str: str) -> dict:
    # 解析JSON字符串
    yesterday_data = json.loads(yesterday_data_str)
    today_data = json.loads(today_data_str)

    # 创建一个字典来存储昨天的任务数据，使用创建日期 + 任务名作为键
    yesterday_dict = {(task['创建日期'], task['外呼任务名称']): task for task in yesterday_data}

    # 创建一个列表来存储结果
    result = []

    # 遍历今天的任务数据
    for task in today_data:
        key = (task['创建日期'], task['外呼任务名称'])
        if key in yesterday_dict:
            # 如果任务昨天存在，计算增量
            yesterday_task = yesterday_dict[key]
            new_task = {
                "任务ID": task['任务ID'],
                "外呼任务名称": task['外呼任务名称'],
                "创建日期": task['创建日期'],
                "外呼量": str(int(task['外呼量']) - int(yesterday_task['外呼量'])),
                "接通量": str(int(task['接通量']) - int(yesterday_task['接通量'])),
                "A意向数": str(int(task['A意向数']) - int(yesterday_task['A意向数']) if task['A意向数'] is not None and yesterday_task['A意向数'] is not None else int(task['A意向数'] if task['A意向数'] is not None else 0)),
                "B意向数": str(int(task['B意向数']) - int(yesterday_task['B意向数']) if task['B意向数'] is not None and yesterday_task['B意向数'] is not None else int(task['B意向数'] if task['B意向数'] is not None else 0)),
                "AB意向数": str(int(task['AB意向数']) - int(yesterday_task['AB意向数']) if task['AB意向数'] is not None and yesterday_task['AB意向数'] is not None else int(task['AB意向数'] if task['AB意向数'] is not None else 0)),
                "计费分钟数": str(int(task['计费分钟数']) - int(yesterday_task['计费分钟数']))
            }
            # 只添加增量不为0的任务
            if int(new_task['外呼量']) != 0:
                result.append(new_task)
        else:
            # 如果任务是今天新增的，直接添加
            result.append(task)

    return {"result": json.dumps(result, ensure_ascii=False, indent=4)}
