def individual_serial(group) -> dict:
    return{
        "id": str(group["_id"]),
        "name":group["name"],
        "users": group["users"],
    }
    
def list_serial(groups)->list:
    return[individual_serial(group) for group in groups]