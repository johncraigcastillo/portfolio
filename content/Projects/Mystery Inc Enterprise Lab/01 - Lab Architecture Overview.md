---
title: 01 - Lab Architecture Overview
description: High-level architecture and technology used in the Mystery Inc Enterprise IT & Security Lab.
date: 2026-09-05
---

The Mystery Inc Enterprise IT & Security Lab runs locally on an Arch Linux host using KVM/QEMU and libvirt. OPNsense provides routing and firewall segmentation between separate CORP, DMZ, SECURITY, and ATTACK networks.

## Architecture


```mermaid
---
config:
  theme: base
  themeVariables:
    darkMode: true
    background: "#1a1b26"
    primaryColor: "#24283b"
    primaryTextColor: "#c0caf5"
    primaryBorderColor: "#7aa2f7"
    lineColor: "#7aa2f7"
    edgeLabelBackground: "#24283b"
    textColor: "#7dcfff"
---
flowchart TB

INET(["Host NAT / Internet"])
OP{{"OPNsense<br/>Firewall / Router"}}

INET --> OP

CORP("CORP<br/>10.10.10.0/24")
DMZ("DMZ<br/>10.10.20.0/24")
SEC("SECURITY<br/>10.10.30.0/24")
ATK("ATTACK<br/>10.10.40.0/24")

OP --> CORP
OP --> DMZ
OP --> SEC
OP --> ATK

DC["DC01<br/>Windows Server<br/>AD DS + DNS"]
WK["WKSTN01<br/>Windows 11"]
WEB["WEB01<br/>Ubuntu Server"]
KALI["KALI01<br/>Kali Linux"]
SPLUNK["SPLUNK01<br/>Splunk"]

CORP --> DC
CORP --> WK
DMZ --> WEB
SEC --> SPLUNK
ATK --> KALI

DC -. "Windows Logs" .-> SPLUNK
WK -. "Windows / Sysmon Logs" .-> SPLUNK
WEB -. "Linux Logs" .-> SPLUNK
OP -. "Firewall Logs" .-> SPLUNK

classDef internet fill:#24283b,stroke:#e0af68,color:#c0caf5,stroke-width:1.5px;
classDef firewall fill:#24283b,stroke:#9d7cd8,color:#c0caf5,stroke-width:2px;
classDef network fill:#24283b,stroke:#7aa2f7,color:#c0caf5,stroke-width:1.5px;
classDef endpoint fill:#24283b,stroke:#9d7cd8,color:#c0caf5,stroke-width:1.5px;
classDef security fill:#24283b,stroke:#9ece6a,color:#c0caf5,stroke-width:1.5px;

class INET internet;
class OP firewall;
class CORP,DMZ,SEC,ATK network;
class DC,WK,WEB,KALI endpoint;
class SPLUNK security;
```

## Technology

| Area                      | Technology                             |
| ------------------------- | -------------------------------------- |
| Host OS                   | Arch Linux                             |
| Virtualization            | KVM, QEMU                              |
| VM management             | libvirt, virsh                         |
| Virtual disks             | qcow2                                  |
| Firewall / routing        | OPNsense                               |
| Windows server            | Windows Server                         |
| Directory services        | Active Directory DS, DNS, Group Policy |
| Windows endpoint          | Windows 11                             |
| Linux server              | Ubuntu Server                          |
| Security testing          | Kali Linux                             |
| SIEM                      | Splunk                                 |
| Automation                | PowerShell, Bash, Python               |
| Network analysis          | Wireshark                              |
| Future network monitoring | Suricata, Zeek                         |


## Design Notes

- OPNsense routes traffic between the lab networks.
- CORP, DMZ, SECURITY, and ATTACK are separate network segments.
- ATTACK and SECURITY are default-deny unless a specific exercise requires access.
- Active VM disks stay on the internal NVMe.
- Backups and installation media are stored on the external SSD.

## What's Next

> [!info] Next Entry
> [[02 - Removing the Existing CORP Virtual Machines]]