/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 *
 * This product is licensed to you under the Apache License, Version 2.0 (the "License").
 * You may not use this product except in compliance with the License.
 *
 * This product may include a number of subcomponents with separate copyright notices
 * and license terms. Your use of these subcomponents is subject to the terms and
 * conditions of the subcomponent's license, as noted in the LICENSE file.
 */

import { ComputeActions, ComputeContextToolbarActions } from 'actions/Actions';
import Tags from 'components/common/Tags';
import ComputeEditViewVue from 'components/compute/ComputeEditViewVue.html';

export default Vue.component('compute-edit-view', {
  template: ComputeEditViewVue,
  props: {
    model: {
      required: true
    }
  },
  computed: {
    validationErrors() {
      return this.model.validationErrors || {};
    },
    activeContextItem() {
      return this.model.contextView && this.model.contextView.activeItem &&
        this.model.contextView.activeItem.name;
    },
    contextExpanded() {
      return this.model.contextView && this.model.contextView.expanded;
    }
  },
  attached() {
    this.tagsInput = new Tags($(this.$el).find('#tags .tags-input'));
    this.unwatchModel = this.$watch('model', (model, oldModel) => {
        oldModel = oldModel || { item: {} };
        if (model.item.tags !== oldModel.item.tags) {
          this.tagsInput.setValue(model.item.tags);
          this.tags = this.tagsInput.getValue();
        }
    }, {immediate: true});
  },
  detached() {
    this.unwatchModel();
  },
  methods: {
    onPlacementZoneChange(placementZone) {
      this.placementZone = placementZone;
    },
    saveCompute() {
      let model = {
        dto: this.model.item.dto,
        resourcePoolLink: this.placementZone ? this.placementZone.documentSelfLink : null,
        selfLinkId: this.model.item.selfLinkId
      };
      let tags = this.tagsInput.getValue();
      ComputeActions.updateCompute(model, tags);
    },
    openToolbarPlacementZones: ComputeContextToolbarActions.openToolbarPlacementZones,
    closeToolbar: ComputeContextToolbarActions.closeToolbar,
    createPlacementZone: ComputeContextToolbarActions.createPlacementZone,
    managePlacementZones: ComputeContextToolbarActions.managePlacementZones
  }
});
