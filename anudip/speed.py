# Input distance in kilometers
distance = float(input("Enter the distance (in km): "))

# Input time in hours
time = float(input("Enter the time (in hours): "))

# Calculate speed
if time > 0:
    speed = distance / time
    print("The speed is",speed, "km/h.")
else:
    print("Time must be greater than zero.")