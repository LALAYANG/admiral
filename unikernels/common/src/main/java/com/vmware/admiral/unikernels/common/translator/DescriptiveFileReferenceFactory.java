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

public class DescriptiveFileReferenceFactory {

    public DescriptiveFileReference getFileReference(Platform platform) {

        switch (platform) {
        case OSv:
            return new CapstanFileReference();
        case Docker:
            return new DockerFileReference();
        }

        return null;
    }

    public DescriptiveFileReference getFileReferenceWithArgs(Platform platform, String base,
            String language, String workDir, String executableName, String givenName) {
        switch (platform) {
        case OSv:
            return new CapstanFileReference(base, language, workDir, executableName, givenName);
        case Docker:
            return new DockerFileReference(base, language, workDir, executableName, givenName);
        }

        return null;
    }
}
