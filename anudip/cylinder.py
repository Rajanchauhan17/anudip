# Input radius and height of the cylinder
radius = float(input("Enter radius: "))
height = float(input("Enter height: "))

# Calculate curved surface area, total surface area, and volume
curved_surface_area = 2 * 3.14 * radius * height  #curved surface area
total_surface_area = 2 * 3.14 * radius * (radius + height)  #total surface area
volume = 3.14 * radius**2 * height    #volume

# Display results
print("Curved Surface Area: ",curved_surface_area)
print("Total Surface Area: ",total_surface_area)
print("Volume: ",volume)
