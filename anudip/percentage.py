
# Input marks for five subjects
marks = []
for i in range(1, 6):
    marks.append(float(input(f"Enter marks for subject {i}: ")))

# Calculate total and percentage
total = sum(marks)
percentage = (total / 500) * 100

# Display results
print("Total Marks:",total)
print("Percentage: ",percentage)