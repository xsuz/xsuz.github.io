## Archives： {{ .Title }}
</pre>
{{ range .Data.Pages }}
<li>
    <div class="date">{{ .Date.Format "2006.01.02 (Mon)" }}</div>
    <a href="{{ .Permalink }}">{{ .Title }}</a>
</li>
{{ end }}
