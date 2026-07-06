; Cursus NSIS custom installer/uninstaller script

!macro customInit
  ; Check if already installed
  ReadRegStr $0 HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\com.minik.cursus" "InstallLocation"
  ${If} $0 == ""
    ReadRegStr $0 HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\com.minik.cursus" "InstallLocation"
  ${EndIf}

  ${If} $0 != ""
    MessageBox MB_ABORTRETRYIGNORE|MB_ICONQUESTION \
      "Cursus is already installed.$\r$\n$\r$\nAbort = Close setup$\r$\nRetry = Uninstall first, then reinstall$\r$\nIgnore = Reinstall (overwrite existing)" \
      /SD IDIGNORE \
      IDRETRY uninstallFirst \
      IDIGNORE skipAbort
      Abort

    uninstallFirst:
      DetailPrint "Running existing uninstaller..."
      ExecWait '"$0\Uninstall Cursus.exe" /S _?=$0'
      Delete "$0\Uninstall Cursus.exe"
      RmDir /r "$0"
      DetailPrint "Old installation removed."

    skipAbort:
  ${EndIf}
!macroend

!macro customUnInstall
  MessageBox MB_YESNO|MB_ICONQUESTION \
    "Delete all user data?$\r$\n$\r$\nThis will remove your configuration, settings, recent files, and AI preferences.$\r$\n$\r$\nChoose Yes to delete everything, No to keep your settings for next installation." \
    /SD IDNO \
    IDNO skipDataDelete

    RmDir /r "$APPDATA\cursus"
    DetailPrint "User data deleted."

  skipDataDelete:
!macroend
