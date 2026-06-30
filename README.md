# 1. Initialize Git tracking inside your local folder
git init

# 2. Stage all your project files to be saved
git add .

# 3. Create your first save point (snapshot)
git commit -m "Initial commit"

# 4. Point your local folder to your online GitHub repository
# (Replace the URL with your actual GitHub repository URL)
git remote add origin https://github.com

# 5. Rename your default branch to 'main'
git branch -M main

# 6. Push your local files up to the live GitHub server
git push -u origin main
