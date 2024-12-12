# Input from the user
distance = float(input("Enter the distance in kilometers: "))

# Initialize the fare variable
fare = 0

# Calculate the fare based on the distance
if distance <= 50:
    fare = distance * 8
elif distance <= 100:
    fare = 50 * 8 + (distance - 50) * 10
else:
    fare = 50 * 8 + 50 * 10 + (distance - 100) * 12

print(f"The total fare for {distance} KM is: Rs. {fare:.2f}")
