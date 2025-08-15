VSC–CTC Modular Platform (Merged Build)

This repository contains the merged deployment of the Virtual Simulated Clinician (VSC) auto-propagation logic with the CTC_Modular scaffolding.
The build maintains the complete CTC module layout while integrating live DSM→CTC→MSE/Treatment Plan data propagation, session persistence, and Care Tier synchronization.

Key Features:

DSM→CTC Publisher: Captures DSM text, risk narrative, and key indicators; computes Care Tier; broadcasts data across modules.

MSE Consumer: Auto-populates thought content and risk summary fields in real time from DSM→CTC input.

Treatment Plan Consumer: Auto-appends problems, goals, objectives, and interventions based on current Care Tier and flags.

Session Persistence: Retains session data across modules and refreshes.

Care Tier Override: Supports safety override enforcement with downstream updates.

Intellectual Property Notice

© 2025 David Livingston Manning. All rights reserved.
This software, its underlying logic, algorithms, workflows, and related trade secrets are proprietary and constitute confidential intellectual property of the author.

Unauthorized reproduction, modification, distribution, or reverse engineering of any portion of this repository, whether in part or in whole, is strictly prohibited without prior written consent. This includes, but is not limited to:

The behavioral simulation logic linking DSM→CTC→MSE/Treatment Plan.

The “Simulated Clinician Reflex Loop” and other proprietary algorithmic sequences.

All auto-documentation, care-tier classification, and live-propagation features.

Any licensed use must be governed by a separate, signed agreement specifying permitted scope and conditions.

Disclaimer:
The Virtual Simulated Clinician (VSC) and CTC components are intended for demonstration and protected intellectual property review purposes only. This implementation is not certified for clinical deployment without further compliance, security, and legal review.
