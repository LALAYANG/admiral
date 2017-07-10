/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 *
 * This product is licensed to you under the Apache License, Version 2.0 (the "License").
 * You may not use this product except in compliance with the License.
 *
 * This product may include a number of subcomponents with separate copyright notices
 * and license terms. Your use of these subcomponents is subject to the terms and
 * conditions of the subcomponent's license, as noted in the LICENSE file.
 */

package com.vmware.admiral.unikernels.common.translator;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.Scanner;

import com.vmware.admiral.unikernels.common.exceptions.CapstanFileFormatException;
import com.vmware.admiral.unikernels.common.exceptions.DockerFileFormatException;

public class Parser {

    private File descriptiveFile;
    private Reader reader;
    private BufferedReader bR;
    private Scanner scanner;
    private String[] reading;

    public Parser(String path) throws FileNotFoundException {
        descriptiveFile = new File(path);
        reader = new FileReader(descriptiveFile);
        bR = new BufferedReader(reader);
        scanner = new Scanner(bR);
        readStream();
    }

    public Parser(InputStream stream) {
        reader = new InputStreamReader(stream);
        bR = new BufferedReader(reader);
        scanner = new Scanner(bR);
        readStream();
    }

    private void readStream() {
        String readLine = "";
        String readFile = "";

        while (scanner.hasNextLine()) {
            readLine = scanner.nextLine();
            if (readLine.trim() != "")
                readFile = readFile + "\n" + readLine;
        }

        reading = readFile.split("\\r?\\n");

    }

    public String[] getReading() {
        return reading;
    }

    public String getTagArgs(String tag) {
        for (String tagLine : reading) {
            if (tagLine.contains(tag))
                return tagLine;
        }

        return "";
    }

    public CapstanFileReference parseCapstan() throws CapstanFileFormatException {
        // files are annotated below the files: tag with a
        // double space before
        return new CapstanFileReference(getTagArgs("base"), getTagArgs("cmdline"),
                getTagArgs("  "));
    }

    public DockerFileReference parseDocker() throws DockerFileFormatException {
        return new DockerFileReference(getTagArgs("FROM"), getTagArgs("CMD"), getTagArgs("COPY"),
                getTagArgs("WORKDIR"));
    }
}
