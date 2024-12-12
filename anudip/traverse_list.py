# Original list
colors = ['red', 'green', 'white', 'black']

print("Original list:", colors)
print("Traverse the list in reverse order:")

# Traverse the list in reverse order and print the elements with their original indices
for i in range(len(colors)-1, -1, -1):
    print(f"Index {i}: {colors[i]}")
