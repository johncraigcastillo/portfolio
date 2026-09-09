---
title: 02 - Removing the Existing CORP Virtual Machines
date: 2026-09-06
type: technical-writeup
status: draft
tags:
  - portfolio
---
## Context
During the first build of DC01 and WKSTN01, I completed much of the setup using PowerShell and command-line tools.

Although the environment worked, I realized I was relying on commands faster than I was understanding the underlying Windows administration concepts. I decided to remove both systems and rebuild them using the graphical management tools first.

## Objective

The goal of the rebuild is to get more comfortable with the Windows Server and Active Directory interfaces and understand where settings are located. In this note, I am documenting the removal of the existing DC01 and WKSTN01 virtual machines before rebuilding them separately.

## Environment
See [[01 - Lab Architecture Overview]] for more detail.
- Systems involved: DC01, WKSTN01
- Network / segment: CORP — 10.10.10.0/24
- Virtualization: KVM/QEMU, libvirt, virsh
- Storage: qcow2 virtual disks

## What I Did

### 1. Verified Recovery Copies and Current VM State

Confirmed that the existing DC01 backup was preserved before removing the active Windows virtual machines.

```sh
❯ /mnt/ssk-ssd ❯ eza -T backups                                                    
backups
├── DC01-Mystery-Inc-audit-baseline-20260830
│   ├── DC01.qcow2
│   ├── DC01.xml
│   ├── DC01_VARS.fd
│   └── SHA256SUMS
├── DC01-post-AD-baseline-20260802
│   ├── DC01.qcow2
│   ├── DC01.xml
│   └── DC01_VARS.fd
└── SOURCE-SHA256-VERIFICATION-20260905.txt
```

The backup set contains the main pieces needed to recover the virtual machine:
- `DC01.qcow2` - the VM's virtual hard drive. It contains Windows Server, installed roles, configuration, and data.
- `DC01.xml` - the libvirt configuration that describes how the VM is built, including CPU, memory, disks, firmware, and network interfaces.
- `DC01_VARS.fd` - the VM's saved UEFI firmware state, including boot-related settings.
- `SHA256SUMS` - a list of file hashes used to check that backup files have not changed or become corrupted.
- `SOURCE-SHA256-VERIFICATION-20260905.txt` - a separate verification record confirming the copied backup files matched the original source files.

I didn't bother creating a backup of WKSTN01. Soon after joining it to the domain, I decided to walk through DC01 again.


### 2. Confirmed both VMs are shut down
Before making any destructive changes, I confirmed that both Windows virtual machines were powered off.

```sh
❯ virsh -c qemu:///system list --all
 Id   Name       State
---------------------------
 -    DC01       shut off
 -    KALI01     shut off
 -    opnsense   shut off
 -    WEB01      shut off
 -    WKSTN01    shut off
```

### 3. Verified their attached storage paths
I checked the attached disks so I knew exactly which active virtual disk files belonged to DC01 and WKSTN01 before removing anything.

```sh
❯ virsh -c qemu:///system domblklist DC01                         
❯ virsh -c qemu:///system domblklist WKSTN01

 Target   Source
----------------------------------------------
 sda      /var/lib/libvirt/images/DC01.qcow2
 sdb      -

 Target   Source
-------------------------------------------------
 sda      /var/lib/libvirt/images/WKSTN01.qcow2
 sdb      -
```

### 4. Undefined both virtual machines

I removed the VM definitions, UEFI NVRAM state, and TPM state, but intentionally left the virtual disks in place so I could verify the removal before deleting storage.

```sh
❯ sudo virsh -c qemu:///system undefine DC01 --nvram --tpm
Domain 'DC01' has been undefined

❯ sudo virsh -c qemu:///system undefine WKSTN01 --nvram --tpm
Domain 'WKSTN01' has been undefined
```

I confirmed that DC01 and WKSTN01 no longer appeared in libvirt before deleting their active virtual disks.
```sh
❯ virsh -c qemu:///system list --all
 Id   Name       State
---------------------------
 -    KALI01     shut off
 -    opnsense   shut off
 -    WEB01      shut off
```

### 5. Removed the active virtual disks
I deleted the DC01 and WKSTN01 virtual disks from internal storage.

```sh
❯ sudo rm /var/lib/libvirt/images/DC01.qcow2
❯ sudo rm /var/lib/libvirt/images/WKSTN01.qcow2
```
Then confirmed removal.
```sh
❯ eza -T /var/lib/libvirt/images
/var/lib/libvirt/images
├── iso
├── KALI01.qcow2
├── opnsense.qcow2
└── WEB01.qcow2
```

### 6. Verified lab networks preserved
I confirmed that removing DC01 and WKSTN01 did not affect the existing libvirt networks used by the lab. (DC01 and WKSTN01 existed on soc-corp)

```sh
❯ virsh -c qemu:///system net-list --all
 Name           State    Autostart   Persistent
-------------------------------------------------
 default        active   yes         yes
 soc-attack     active   yes         yes
 soc-corp       active   yes         yes
 soc-dmz        active   yes         yes
 soc-security   active   yes         yes
```


## Verification

I verified that the decommissioning steps completed successfully by confirming:

- DC01 and WKSTN01 no longer appeared in `virsh -c qemu:///system list --all`.
- Their active virtual disks were no longer present in `/var/lib/libvirt/images`.
- The remaining lab VMs and disks were unaffected.
- All existing libvirt network definitions, including `soc-corp`, were still present and active.

## What I Learned

This process helped me better understand the separation between a virtual machine's definition, its storage, its firmware/TPM state, and the virtual networks it connects to.

I also learned why destructive changes are safer when performed in stages:

- verify the current state
- remove the VM definition
- confirm the definition is gone
- remove the virtual disk
- verify the surrounding infrastructure is still intact

## Current State of Lab

![[dc01-and-wkstn01-removed.png]]

## Next Step

Remove the existing `soc-corp` configuration from both libvirt and OPNsense so the CORP network can be rebuilt from scratch and documented separately.

> [!info] Next Entry
> [[03 - Removing the Existing CORP Network Configuration]]