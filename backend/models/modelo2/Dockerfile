FROM cford38/plapt:latest

# Install FastAPI + Uvicorn into plapt environment
RUN conda run -n plapt pip install --no-cache-dir fastapi "uvicorn[standard]"

WORKDIR /app

# Copy your API code
COPY ./app /app

# Make plapt library visible
ENV PYTHONPATH=/software/plapt

EXPOSE 5002

# Correct conda-run command
CMD ["conda", "run", "--no-capture-output", "-n", "plapt", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5002"]
