def find_index(search_index, target):
    for i, value in enumerate(search_index):
        if value == target:
            return i
    return -1


mylist = [1, 2, 3, 4, 5, 6]
print(find_index(mylist, 6))
