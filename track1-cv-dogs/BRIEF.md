# Internship Assessment — Computer Vision Track

## Overview

You're joining a team building a computer vision system for individual animal identification. Your task is to design and prototype a pipeline that can **re-identify individual dogs** across a set of images.

This is a **re-identification (ReID)** problem — not breed classification or detection. The challenge is distinguishing one specific dog from another, even dogs of the same breed, using fine-grained visual features.

You do not need to build a production system. We are evaluating your technical judgment, your ability to work through ambiguity, and how you communicate your reasoning.

---

## Task

Build a pipeline that:

1. Takes a **reference image** (or small gallery of images) of a dog
2. Given a set of **query images**, identifies which images contain the same dog

Your pipeline should be able to answer: *"Is this the same dog as in the reference?"*

---

## Dataset

You are responsible for sourcing or preparing your own evaluation dataset. Some starting points:

- [Stanford Dogs Dataset](http://vision.stanford.edu/aditya86/ImageNetDogs/)
- [DogFaceNet](https://github.com/GuillaumeMougeot/DogFaceNet)
- OpenImages (dog subset)
- Your own curated samples

How you handle data selection and preparation is part of the assessment. There is no single right answer — document your choices and why you made them.

---

## Deliverables

Submit a link to a git repository containing the following. **Time window: 5–7 days.**

### 1. Working Prototype

A runnable pipeline with a clear entry point (e.g. a script or notebook). It should:
- Accept a reference image and a set of query images
- Return a ranked list or similarity scores indicating which queries match the reference
- Include a `README.md` with setup and usage instructions

You may use any framework (PyTorch, HuggingFace, TensorFlow, OpenCV, etc.).

### 2. Evaluation

Evaluate your pipeline on your chosen dataset. Include:
- The metric(s) you chose and why (e.g. Rank-1 accuracy, mAP, threshold-based precision/recall)
- Results on both positive matches (same dog) and negative matches (different dogs)
- At least **one visualisation** of results — show cases where the system succeeds and where it fails

### 3. Written Report (`REPORT.md`, ~500 words)

Address the following:

- **Approach:** What did you build and why? Walk through your key design decisions (feature extractor, similarity metric, embedding strategy, etc.)
- **Failure modes:** Identify at least **two specific failure modes** you observed. For each, propose a concrete mitigation.
- **Generalisation:** If you were applying this pipeline to a different species with far less publicly available data (e.g. sheep), what would need to change? What assumptions in your current approach would break?

---

## Extension (optional)

Strong candidates may also tackle open-set recognition: what happens when a query image contains a dog that does **not** appear in the reference gallery? How should the system behave, and how do you evaluate it?

---

## What We're Looking For

We are not looking for a perfect model. We are looking for:

- Sound technical reasoning behind your design choices
- An honest, rigorous evaluation — including failure cases, not just successes
- Clear written communication
- Evidence that you understand *why* your approach works (or doesn't)

---

## Submission

Open a pull request in your repository and email the link to the hiring contact. The PR description is part of the assessment — treat it as you would a real PR going to a team that hasn't seen your work.

A strong PR description includes:

- **Summary** — what you built and the key decisions you made
- **Screenshots or output** — visualisations of results, example matches/non-matches, evaluation metrics rendered or screenshotted
- **Approach walkthrough** — brief explanation of your pipeline with enough detail that a reviewer can follow your reasoning without reading every line of code
- **What didn't work** — honest account of approaches you tried that failed or underperformed, and why
- **Known limitations** — what the system can't handle well, and what you'd address next

A PR description that is thin, vague, or just a list of files changed will be scored accordingly.
