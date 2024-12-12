# Given string
input_string = "Welcome to python Training"

# Convert the string to lowercase to count vowels case-insensitively
input_string = input_string.lower()

# Initialize a dictionary to store the count of each vowel
vowel_count = {'a': 0, 'e': 0, 'i': 0, 'o': 0, 'u': 0}

# Count the vowels in the string
for char in input_string:
    if char in vowel_count:
        vowel_count[char] += 1

# Display the counts
print("Vowel counts:")
for vowel, count in vowel_count.items():
    print(f"{vowel}: {count}")
