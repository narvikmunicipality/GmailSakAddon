#tool nuget:?package=NUnit.ConsoleRunner&version=3.4.0
#addin nuget:?package=Cake.Npm&version=0.17.0
using System.Text.RegularExpressions;

var sourceDirectory = Directory("./src");
var buildDirectory = Directory("./build");
var publishDirectory = buildDirectory + Directory("publish");
var srcAppSettingsJson = sourceDirectory + File("appsscript.json");
var publishAppSettingsJson = publishDirectory + File("appsscript.json");
var testAppSettingsJson = buildDirectory + File("test-appsscript.json");
var claspCmd = Directory(EnvironmentVariable("APPDATA")) + Directory("npm") + File("clasp.cmd");
var claspJson = File(".clasp.json");
var testClaspJson = buildDirectory + File("test.example.clasp.json");
var exampleComClaspJson = buildDirectory + File("example.clasp.json");

public static List<string> TrimEmptyStrings(this IEnumerable<string> strings)
{
    return strings.Select(x => Regex.Replace(x, @"[^\u0020-\u007E]+", string.Empty)).Where(x => !string.IsNullOrWhiteSpace(x) && x != "[2K[1G").Select(i => (string)i.Clone()).ToList();
}

public bool IsClaspInstalled() 
{
    return StartProcess("where", new ProcessSettings { Arguments = "clasp", Silent = true, RedirectStandardError = true, RedirectStandardOutput = true }, out _, out _) == 0;
}

public void Clasp(string arguments)
{
    IEnumerable<string> stderr, stdout;
    RunCommand(claspCmd, new ProcessSettings { Arguments = "push --force" }, out stderr, out stdout);

    var clonedStdErr = stderr.Select(i => (string)i.Clone()).ToList();
    var errorMessage = string.Join("\n", clonedStdErr);

    if (errorMessage.Contains("GaxiosError"))
    {
        throw new Exception(errorMessage);
    }
}

public void RunCommand(string command, ProcessSettings processSettings, out IEnumerable<string> redirectedErrorOutput, out IEnumerable<string> redirectedStandardOutput)
{
    processSettings.RedirectStandardOutput = true;
    processSettings.RedirectStandardError = true;

    var stderr = new List<string>();
    var stdout = new List<string>();

    if (StartProcess(command, processSettings, out redirectedStandardOutput, out redirectedErrorOutput) != 0) 
    {
        stderr = redirectedErrorOutput.TrimEmptyStrings();
        stdout = redirectedStandardOutput.TrimEmptyStrings();

        var outputText = new List<string>();
        outputText.Add($"{claspCmd}");

        if (stderr.Count > 0)
        {
            outputText.Add("stderr:");
            outputText.Add(string.Join("\n", stderr.Select(x => $"\t{x}")));
        }
        
        if (stdout.Count > 0)
        {
            outputText.Add("stdout:");
            outputText.Add(string.Join("\n", stdout.Select(x => $"\t{x}")));
        }

        throw new Exception(string.Join("\n", outputText));
    }
}

Task("Clean")
    .Does(() =>
{
    if (FileExists(claspJson)) 
    {
        DeleteFile(claspJson);
    }

    if (DirectoryExists(publishDirectory))
    {
        DeleteDirectory(publishDirectory, new DeleteDirectorySettings { Recursive = true });
    }

    CopyDirectory(sourceDirectory, publishDirectory);
});

Task("npm install")
    .IsDependentOn("Clean")
    .Does(() =>
{
    if (!IsClaspInstalled()) {
        NpmInstall(settings => settings.AddPackage("clasp").InstallGlobally());
    } else {
        Information("clasp already installed - skipping reinstall.");
    }
    NpmInstall();
});

Task("Jasmine tests")
    .IsDependentOn("npm install")
    .Does(() =>
{
    var testSettings = new NpmRunScriptSettings { ScriptName = "test" };
    NpmRunScript(testSettings);
});

Task("dev")
    .IsDependentOn("Jasmine tests")
    .Does(() =>
{
    Information("Pushing test project to example.com");
    CopyFile(testAppSettingsJson, publishAppSettingsJson);
    CopyFile(testClaspJson, claspJson);
    Clasp("push --force");
});

Task("example.com")
    .IsDependentOn("Jasmine tests")
    .Does(() =>
{
    Information("Pushing project to example.com");
    CopyFile(srcAppSettingsJson, publishAppSettingsJson);
    CopyFile(exampleComClaspJson, claspJson);
    Clasp("push --force");
});

Task("all")
    .IsDependentOn("dev")
    .IsDependentOn("example.com")
    .Does(() =>
{
});

Task("Default")
    .IsDependentOn("dev");

RunTarget(Argument("target", "Default"));
