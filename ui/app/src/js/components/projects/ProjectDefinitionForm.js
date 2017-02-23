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

import ProjectDefinitionFormVue from 'components/projects/ProjectDefinitionFormVue.html';
import utils from 'core/utils';
import constants from 'core/constants';

let constraints = {
  projectName: function(projectName) {
    if (!projectName || validator.trim(projectName).length === 0) {
      return 'errors.required';
    }
  }
};

var ProjectDefinitionForm = Vue.extend({

  template: ProjectDefinitionFormVue,
  props: {
    model: {
      required: false,
      type: Object
    }
  },

  data: function() {
    return {
      projectName: ''
    };
  },

  methods: {

    getProjectDefinition: function() {
      var project = {
        name: this.projectName
      };
      if (this.model) {
        project.documentSelfLink = this.model.documentSelfLink;
      }
      return project;
    },

    validate: function() {
      var definition = this.getProjectDefinition();
      var validationErrors = utils.validate(definition, constraints);
      this.applyValidationErrors(validationErrors);
      return validationErrors;
    },

    applyValidationErrors: function(errors) {
      errors = errors || {};
      var projectName = $(this.$el).find('.project-name');
      utils.applyValidationError(projectName, errors.projectName);
    },

    requiredInputChanged: function() {
      let filledRequiredInputs = false;
      let projectName = $(this.$el).find('.project-name .form-control').val();
      if (projectName && projectName.trim().length > 0) {
        filledRequiredInputs = true;
      }
      this.$dispatch('required-input-changed', filledRequiredInputs);
    }
  },

  watch: {
    projectName: function() {
      this.requiredInputChanged();
    }
  },

  attached: function() {
    this.unwatchModel = this.$watch('model', (project) => {
      if (project) {
        this.projectName = project.name;

        var alertMessage = project.error && project.error._generic;
        if (alertMessage) {
          this.$dispatch('container-form-alert', alertMessage, constants.ALERTS.TYPE.FAIL);
        }
      }
    }, {immediate: true});
  },

  detached: function() {
    this.unwatchModel();
  }

});

Vue.component('project-definition-form', ProjectDefinitionForm);

export default ProjectDefinitionForm;
