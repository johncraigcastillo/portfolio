---
title: Architecture Overview
description: High-level architecture and technology used in the Mystery Inc Enterprise IT & Security Lab.
---

The Mystery Inc Enterprise IT & Security Lab runs locally on an Arch Linux host using KVM/QEMU and libvirt. OPNsense provides routing and firewall segmentation between separate CORP, DMZ, SECURITY, and ATTACK networks.

## Architecture

```mermaid
flowchart TB
    NAT["Host NAT / Internet"] --> FW["OPNsense"]

    FW --> CORP["CORP<br/>10.10.10.0/24"]
    FW --> DMZ["DMZ<br/>10.10.20.0/24"]
    FW --> SEC["SECURITY<br/>10.10.30.0/24"]
    FW --> ATTACK["ATTACK<br/>10.10.40.0/24"]

    CORP --> DC["DC01<br/>Windows Server<br/>AD DS + DNS"]
    CORP --> WKS["WKSTN01<br/>Windows 11"]

    DMZ --> WEB["WEB01<br/>Ubuntu Server"]

    SEC --> SPLUNK["SPLUNK01<br/>Splunk"]

    ATTACK --> KALI["KALI01<br/>Kali Linux"]

    DC -. Windows logs .-> SPLUNK
    WKS -. Windows / Sysmon logs .-> SPLUNK
    WEB -. Linux logs .-> SPLUNK
    FW -. Firewall logs .-> SPLUNK
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