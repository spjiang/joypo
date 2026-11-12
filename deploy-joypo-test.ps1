$ErrorActionPreference = 'Continue'
$key = 'C:\Users\Administrator\.ssh\id_rsa_wq_park'
$target = 'root@39.103.56.168'
$log = 'e:\joypo\deploy-joypo-test-result.txt'
$opts = @(
  '-i', $key,
  '-o', 'StrictHostKeyChecking=accept-new',
  '-o', 'BatchMode=yes',
  '-o', 'ConnectTimeout=25'
)
$files = @(
  @{ src = 'e:\joypo\skin\css\joypo-mobile.css'; dst = '/home/spjiangl/joypo/skin/css/joypo-mobile.css' },
  @{ src = 'e:\joypo\skin\js\joypo-home-m.js'; dst = '/home/spjiangl/joypo/skin/js/joypo-home-m.js' },
  @{ src = 'e:\joypo\skin\js\joypo-anim.js'; dst = '/home/spjiangl/joypo/skin/js/joypo-anim.js' },
  @{ src = 'e:\joypo\template\default\head.html'; dst = '/home/spjiangl/joypo/template/default/head.html' },
  @{ src = 'e:\joypo\template\default\index.html'; dst = '/home/spjiangl/joypo/template/default/index.html' },
  @{ src = 'e:\joypo\template\default\about.html'; dst = '/home/spjiangl/joypo/template/default/about.html' }
)
$lines = New-Object System.Collections.Generic.List[string]
$lines.Add('START ' + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))
$lines.Add('KEY_EXISTS ' + (Test-Path -LiteralPath $key))
$lines.Add('SCP ' + (Get-Command scp -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source))
$lines.Add('SSH ' + (Get-Command ssh -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source))

foreach ($f in $files) {
  if (-not (Test-Path -LiteralPath $f.src)) {
    $lines.Add('COPY FAIL missing-local ' + $f.src)
    continue
  }
  $len = (Get-Item -LiteralPath $f.src).Length
  $out = & scp @opts $f.src ($target + ':' + $f.dst) 2>&1 | Out-String
  $code = $LASTEXITCODE
  $status = if ($code -eq 0) { 'OK' } else { 'FAIL' }
  $lines.Add(('COPY {0} exit={1} bytes={2} {3}' -f $status, $code, $len, $f.dst))
  if ($out.Trim()) { $lines.Add('SCP_OUT ' + $out.Trim()) }
}

$remote = @'
rm -f /home/spjiangl/joypo/runtime/complile/*.php /home/spjiangl/joypo/runtime/compile/*.php
echo RM_DONE
echo '---GREP---'
grep -n 20261112a /home/spjiangl/joypo/template/default/head.html
echo GREP_EXIT:$?
echo '---REMOTE---'
wc -c /home/spjiangl/joypo/skin/css/joypo-mobile.css /home/spjiangl/joypo/skin/js/joypo-home-m.js /home/spjiangl/joypo/skin/js/joypo-anim.js /home/spjiangl/joypo/template/default/head.html /home/spjiangl/joypo/template/default/index.html /home/spjiangl/joypo/template/default/about.html
'@
$sshOut = & ssh @opts $target $remote 2>&1 | Out-String
$lines.Add('SSH_EXIT ' + $LASTEXITCODE)
$lines.Add($sshOut.TrimEnd())
$lines.Add('END ' + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))
$lines | Set-Content -LiteralPath $log -Encoding UTF8
